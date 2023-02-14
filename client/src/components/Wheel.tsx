import { useEffect, useState } from "react";
import { LuckyWheelSegment } from "../types";

type Props = {
    segments: LuckyWheelSegment[];
    onFinished: Function;
    canvasSize: number;
    fontSize: number;
    fontFamily: string;
};

function Wheel(props: Props) {
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const maxSpeed = 0.1; // 0.05 slow, 0.1 medium, 0.2 fast
    const timerDelay = props.segments.length;
    const upDuration = 100;
    const downDuration = 1000;
    const centerX = props.canvasSize / 2;
    const centerY = props.canvasSize / 2;
    const size = props.canvasSize / 2.5;
    const primaryColor = "black";
    const secondaryColor = "white";
    const upTime = props.segments.length * upDuration;
    const downTime = props.segments.length * downDuration;
    let currentSegment: LuckyWheelSegment = {} as LuckyWheelSegment;
    let isStarted = false;
    let timerId = 0;
    let angleCurrent = 0;
    let angleDelta = 0;
    let canvasContext: CanvasRenderingContext2D | null = null;
    let spinStart = 0;
    let frames = 0;

    useEffect(() => {
        if (isStarted) return;
        wheelInit();
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 0);
    }, [props.segments]);

    function wheelInit() {
        initCanvas();
        draw();
    }

    function initCanvas() {
        const canvas = document.getElementById("canvas");
        if (!canvas) return;
        canvas.addEventListener("click", spin, false);
        canvasContext = (canvas as HTMLCanvasElement).getContext("2d");
    }

    function spin() {
        if (isStarted) return;
        isStarted = true;
        if (timerId === 0) {
            spinStart = new Date().getTime();
            frames = 0;
            timerId = window.setInterval(onTimerTick, timerDelay);
        }
    }

    function onTimerTick() {
        frames++;
        draw();
        const duration = new Date().getTime() - spinStart;
        let progress = 0;
        let finished = false;
        if (duration < upTime) {
            progress = duration / upTime;
            angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
        } else {
            progress = duration / downTime;
            angleDelta =
                maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
            if (progress >= 1) finished = true;
        }

        angleCurrent += angleDelta;
        while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2;
        if (finished) {
            setIsFinished(true);
            props.onFinished(currentSegment);
            clearInterval(timerId);
            timerId = 0;
            angleDelta = 0;
            isStarted = false;
        }
    }

    function draw() {
        clear();
        drawWheel();
        drawNeedle();
    }

    function drawSegment(idx: number, lastAngle: number, angle: number) {
        const ctx = canvasContext;
        if (!ctx) return;
        const text = props.segments[idx].text;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, size, lastAngle, angle, false);
        ctx.closePath();
        ctx.fillStyle = props.segments[idx].color;
        ctx.fill();
        ctx.stroke();
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((lastAngle + angle) / 2);
        ctx.fillStyle = primaryColor;
        ctx.font = `bold ${props.fontSize}px ${props.fontFamily}`;
        ctx.fillText(text, size / 2 + 20, 0);
        ctx.restore();
    }

    function drawWheel() {
        const ctx = canvasContext;
        if (!ctx) return;
        let lastAngle = angleCurrent;
        ctx.lineWidth = 1;
        ctx.strokeStyle = primaryColor;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = `bold ${props.fontSize}px ${props.fontFamily}`;
        for (let i = 1; i <= props.segments.length; i++) {
            const angle =
                (Math.PI * 2 * i) / props.segments.length + angleCurrent;
            drawSegment(i - 1, lastAngle, angle);
            lastAngle = angle;
        }

        // Draw center circle for needle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = primaryColor;
        ctx.lineWidth = 10;
        ctx.strokeStyle = secondaryColor;
        ctx.fill();
        ctx.font = `bold ${props.fontSize}px ${props.fontFamily}`;
        ctx.fillStyle = secondaryColor;
        ctx.textAlign = "center";
        ctx.fillText("Spin", centerX, centerY + 3);
        ctx.stroke();

        // Draw outer circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.lineWidth = 10;
        ctx.strokeStyle = primaryColor;
        ctx.stroke();
    }

    function drawNeedle() {
        const ctx = canvasContext;
        if (!ctx) return;
        ctx.lineWidth = 1;
        ctx.strokeStyle = secondaryColor;
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.moveTo(centerX + 20, centerY - 50);
        ctx.lineTo(centerX - 20, centerY - 50);
        ctx.lineTo(centerX, centerY - 70);
        ctx.closePath();
        ctx.fill();
        const change = angleCurrent + Math.PI / 2;
        let i =
            props.segments.length -
            Math.floor((change / (Math.PI * 2)) * props.segments.length) -
            1;
        if (i < 0) i = i + props.segments.length;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = primaryColor;
        ctx.font = `bold ${props.fontSize}px ${props.fontFamily}`;
        currentSegment = props.segments[i];
        isStarted &&
            ctx.fillText(
                currentSegment.text,
                centerX + 10,
                centerY + size + 50
            );
    }

    function clear() {
        const ctx = canvasContext;
        if (!ctx) return;
        ctx.clearRect(0, 0, props.canvasSize, props.canvasSize);
    }

    return (
        <canvas
            id="canvas"
            width={props.canvasSize.toString()}
            height={props.canvasSize.toString()}
        />
    );
}

export default Wheel;
