/**
 * Fog Animation
 * Based on: https://jsfiddle.net/jonnyc/Ujz4P/5/
 */

class Particle {
    x: number = 0;
    y: number = 0;
    xVelocity: number = 0;
    yVelocity: number = 0;
    radius: number = 5;
    context: CanvasRenderingContext2D;
    image: HTMLImageElement | null = null;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    draw() {
        if (this.image) {
            this.context.drawImage(this.image, this.x - 128, this.y - 128);
            return;
        }

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fill();
        this.context.closePath();
    }

    update(canvasWidth: number, canvasHeight: number) {
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        // Check edges
        if (this.x >= canvasWidth) {
            this.xVelocity = -this.xVelocity;
            this.x = canvasWidth;
        } else if (this.x <= 0) {
            this.xVelocity = -this.xVelocity;
            this.x = 0;
        }

        if (this.y >= canvasHeight) {
            this.yVelocity = -this.yVelocity;
            this.y = canvasHeight;
        } else if (this.y <= 0) {
            this.yVelocity = -this.yVelocity;
            this.y = 0;
        }
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setVelocity(x: number, y: number) {
        this.xVelocity = x;
        this.yVelocity = y;
    }

    setImage(image: HTMLImageElement) {
        this.image = image;
    }
}

export class FogAnimation {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private particles: Particle[] = [];
    private maxVelocity = 0.7;
    private imageObj: HTMLImageElement;
    private isRunning = false;
    private animationFrameId: number | null = null;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas element with id '${canvasId}' not found`);
        }
        this.canvas = canvas;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get 2D context');
        }
        this.context = ctx;

        this.imageObj = new Image();
        this.imageObj.src = "https://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png";

        this.imageObj.onload = () => {
            this.particles.forEach(p => p.setImage(this.imageObj));
        };

        this.resize();

        let resizeTimeout: number;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => this.resize(), 150);
        });
    }

    private getParticleCount(): number {
        const width = window.innerWidth;
        let count: number;

        if (width <= 768) {
            count = 25;
        } else if (width >= 1200) {
            count = 100;
        } else {
            count = Math.round(25 + ((width - 768) / (1200 - 768)) * 75);
        }

        return count;
    }

    private resize() {
        const parent = this.canvas.parentElement;
        if (parent) {
            const oldWidth = this.canvas.width;
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;

            const targetCount = this.getParticleCount();

            // Initialize particles on first call or when count needs to change
            if (this.particles.length === 0) {
                // First initialization
                this.initParticles();
            } else if (oldWidth > 0 && this.particles.length !== targetCount) {
                // Resize detected, regenerate particles
                this.particles = [];
                this.initParticles();
            }
        }
    }

    private generateRandom(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    private initParticles() {
        const particleCount = this.getParticleCount();
        for (let i = 0; i < particleCount; ++i) {
            const particle = new Particle(this.context);
            particle.setPosition(
                this.generateRandom(0, this.canvas.width),
                this.generateRandom(0, this.canvas.height)
            );
            particle.setVelocity(
                this.generateRandom(-this.maxVelocity, this.maxVelocity),
                this.generateRandom(-this.maxVelocity, this.maxVelocity)
            );

            if (this.imageObj.complete && this.imageObj.naturalWidth > 0) {
                particle.setImage(this.imageObj);
            }

            this.particles.push(particle);
        }
    }

    private draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(particle => particle.draw());
    }

    private update() {
        this.particles.forEach(particle => particle.update(this.canvas.width, this.canvas.height));
    }

    private loop = () => {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    public start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.loop();
    }

    public stop() {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
}

export function initFog(): void {
    try {
        const fog = new FogAnimation('myCanvas');
        fog.start();
    } catch (e) {
        console.warn('Fog animation initialization failed:', e);
    }
}