import React from 'react'

export default function ProgressBar({ progress, size }) {
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    const textPosition = size / 2;

    return (
        <svg width={size} height={size + 30}>
            <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a3a7ff" />
                    <stop offset="25%" stopColor="#7a8ffc" />
                    <stop offset="50%" stopColor="#3c78f2" />
                    <stop offset="75%" stopColor="#0063e8" />
                    <stop offset="100%" stopColor="#0051de" />
                </linearGradient>
            </defs>
            <circle
                className="progress-bar"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke="#ccc"
                fill="none"
            />
            <circle
                className="progress-bar"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                stroke="url(#grad)"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
            />
            <text x="50%" y={textPosition + 70} textAnchor="middle" fill='white'>
                {progress}%
            </text>
        </svg>
    );
};
