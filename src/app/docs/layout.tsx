import Sidebar from '@/components/sidebar';
import TableOfContents from '@/components/docs/toc';
import '@/styles/docs.css';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />

            {/* Nội dung chính */}
            <main className="flex-1 flex justify-center p-8 bg-white">
                <div className="w-full max-w-6xl flex gap-8">
                    {/* Nội dung documentation */}
                    <div className="flex-1 max-w-3xl">{children}</div>

                    {/* Table of Contents */}
                    <aside className="hidden xl:block flex-1">
                        <TableOfContents />
                    </aside>
                </div>
            </main>
        </div>
    );
}
