import Sidebar from '@/components/sidebar';
import TableOfContents from '@/components/docs/toc';
import '@/styles/docs.css';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />

            {/* Nội dung chính */}
            <main className="flex-1 flex justify-center p-0 sm:p-4 pt-0 bg-white">
                <div className="w-full">
                    {/* Nội dung documentation */}
                    <div className="">{children}</div>
                </div>
            </main>
        </div>
    );
}
