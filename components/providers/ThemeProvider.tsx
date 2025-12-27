'use client';

import { useEffect, useState } from 'react';

interface Theme {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    headerBg: string;
    snowEffect: boolean;
    fireworkEffect: boolean;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme | null>(null);

    useEffect(() => {
        fetchActiveTheme();
    }, []);

    const fetchActiveTheme = async () => {
        try {
            const res = await fetch('/api/admin/themes?active=true');
            if (res.ok) {
                const data = await res.json();
                setTheme(data);
                applyTheme(data);
            }
        } catch (error) {
            console.error('Error fetching theme:', error);
        }
    };

    const applyTheme = (t: Theme) => {
        if (!t || t.name === 'default') return;

        // Remove existing theme style
        const existingStyle = document.getElementById('theme-colors');
        if (existingStyle) existingStyle.remove();

        // Create theme style
        const style = document.createElement('style');
        style.id = 'theme-colors';
        style.textContent = `
            /* Background override */
            body, .bg-\\[\\#f5f5fa\\] {
                background-color: ${t.backgroundColor} !important;
            }
            
            /* Primary color overrides */
            .bg-\\[\\#1a94ff\\], .bg-blue-600, .hover\\:bg-blue-700:hover {
                background-color: ${t.primaryColor} !important;
            }
            .text-\\[\\#1a94ff\\], .text-blue-600 {
                color: ${t.primaryColor} !important;
            }
            .border-\\[\\#1a94ff\\] {
                border-color: ${t.primaryColor} !important;
            }
            
            /* Secondary color overrides */
            .bg-\\[\\#ff424e\\], .text-\\[\\#ff424e\\] {
                background-color: ${t.secondaryColor} !important;
            }
            .text-\\[\\#ff424e\\] {
                color: ${t.secondaryColor} !important;
            }
            
            /* Header/Navbar */
            header, .sticky.top-0, nav.bg-white {
                background-color: ${t.headerBg} !important;
                ${t.name !== 'default' ? 'color: white;' : ''}
            }
            ${t.name !== 'default' ? `
                header a, header button, header span, header .text-gray-600, header .text-gray-700, header .text-gray-800 {
                    color: white !important;
                }
                header .bg-gray-100 {
                    background-color: rgba(255,255,255,0.2) !important;
                }
            ` : ''}
            
            /* Accent/Button colors */
            .bg-\\[\\#00ab56\\], .bg-green-600 {
                background-color: ${t.accentColor} !important;
            }
            
            /* Cards on dark backgrounds */
            ${t.backgroundColor.startsWith('#1') || t.backgroundColor.startsWith('#0') || t.backgroundColor === '#8b0000' ? `
                .bg-white {
                    background-color: rgba(255,255,255,0.95) !important;
                }
            ` : ''}
        `;
        document.head.appendChild(style);
    };

    return (
        <>
            {children}

            {/* Snow Effect */}
            {theme?.snowEffect && <SnowEffect />}

            {/* Firework Effect */}
            {theme?.fireworkEffect && <FireworkEffect />}
        </>
    );
}


function SnowEffect() {
    useEffect(() => {
        const container = document.createElement('div');
        container.id = 'snow-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        // Create snowflakes
        for (let i = 0; i < 50; i++) {
            createSnowflake(container);
        }

        return () => {
            const el = document.getElementById('snow-container');
            if (el) el.remove();
        };
    }, []);

    const createSnowflake = (container: HTMLElement) => {
        const snowflake = document.createElement('div');
        snowflake.innerHTML = '❄';
        snowflake.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${Math.random() * 100}%;
            font-size: ${10 + Math.random() * 20}px;
            opacity: ${0.5 + Math.random() * 0.5};
            animation: snowfall ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(snowflake);
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes snowfall {
                0% { transform: translateY(-20px) rotate(0deg); }
                100% { transform: translateY(100vh) rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    return null;
}

function FireworkEffect() {
    useEffect(() => {
        const container = document.createElement('div');
        container.id = 'firework-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            overflow: hidden;
        `;
        document.body.appendChild(container);

        // Create fireworks periodically
        const interval = setInterval(() => {
            createFirework(container);
        }, 2000);

        return () => {
            clearInterval(interval);
            const el = document.getElementById('firework-container');
            if (el) el.remove();
        };
    }, []);

    const createFirework = (container: HTMLElement) => {
        const firework = document.createElement('div');
        const emojis = ['✨', '🎆', '🎇', '💫', '⭐'];
        firework.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        firework.style.cssText = `
            position: absolute;
            left: ${20 + Math.random() * 60}%;
            bottom: 0;
            font-size: ${30 + Math.random() * 30}px;
            animation: firework-rise 2s ease-out forwards;
        `;
        container.appendChild(firework);

        setTimeout(() => firework.remove(), 2000);
    };

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes firework-rise {
                0% { transform: translateY(0) scale(0.5); opacity: 1; }
                50% { transform: translateY(-50vh) scale(1); opacity: 1; }
                100% { transform: translateY(-70vh) scale(1.5); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        return () => style.remove();
    }, []);

    return null;
}
