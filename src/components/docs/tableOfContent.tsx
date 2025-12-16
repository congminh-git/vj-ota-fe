'use client';

import { useEffect, useState } from 'react';
import { TocItem } from '@/lib/markdoc';

interface TableOfContentsProps {
    items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -80% 0px' },
        );

        items.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [items]);

    if (items.length === 0) return null;

    return (
        <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Mục lục</h3>
            <ul className="space-y-2 text-sm">
                {items.map((item) => (
                    <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
                        <a
                            href={`#${item.id}`}
                            className={`block py-1 transition-colors hover:text-blue-600 ${
                                activeId === item.id ? 'text-blue-600 font-medium' : 'text-gray-600'
                            }`}
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                e.preventDefault();
                                document.getElementById(item.id)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start',
                                });
                            }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
