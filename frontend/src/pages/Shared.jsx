import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import {
    FileText,
    Folder,
    Image as ImageIcon,
    Globe,
    Link,
    UserCog,
    Ban
} from 'lucide-react';

const SharedPage = () => {
    //Mock data
    const sharedItems = [
        {
            id: 1,
            name: 'Q3_Financial_Report.pdf',
            type: 'pdf',
            icon: <FileText size={20} className="text-primary" />,
            shareMode: 'public',
            date: '12 Thg 10, 2023',
        },
        {
            id: 2,
            name: 'Marketing_Assets_2024',
            type: 'folder',
            icon: <Folder size={20} className="text-secondary" />,
            shareMode: 'specific',
            date: '05 Thg 10, 2023',
            avatars: [
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCIg3wxEcb1mBery9PiABzd1DupcZ5kNWpQIZtI2FXhhWu9D5hUfs731rrkPlCrYbKB04jAAMswhgT-V7jvNbExwoui6L_xpRDPhnhgV-IWw4n5N7G_JkANLc9t-vCDavgr1UDwmhujkSLv3BGfghHrhzp_fnF-t7Hlul0hBphsTMiD5wUFr90KNqjJZ3eOcmJhyuoidvzrMIfJIhCQNOEnWsoJJIM72tFs1_nvSH2Wz5176ZLnuuA6wpCQyzewhuO7iv_1YkpY3mM',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuB5vaqHZ4eTqN0AB7LTJ41xmD74ETrhgk-BCBJ-IoiRdB6Q-EdKvmpFrWFai9BK0YOxCUd8duNFYBSzrV6NtwcQCzGLqJd3lhOm7S3m1muxVE2YG6tvvDJ9xcm3DVqvjKS-GoU623__2HFsIRTdzUHjnqtekW7ToJLZ5WaKcn_bAHqSwMSRBDo8OmKb3IZOg7dJPwbUD3uQVjPa88toGT1FDr0pz9a7D-7XmEL6H1vgmYzzom8XQI7PyVvfXMh91V1MgIxdhaRLuF0'
            ],
            extraUsersCount: 3,
        },
        {
            id: 3,
            name: 'Team_Retreat_Photo.jpg',
            type: 'image',
            icon: <ImageIcon size={20} className="text-primary" />,
            shareMode: 'public',
            date: '28 Thg 09, 2023',
        },
    ];

    return (
        <DashboardLayout activeMenu="Shared">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface-lowest">
                <div className="max-w-container-max mx-auto">

                    {/* Page Header */}
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                                Đã chia sẻ
                            </h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                Quản lý các tệp và thư mục bạn đã chia sẻ với người khác.
                            </p>
                        </div>
                    </div>

                    {/* Shared Files Table */}
                    <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low border-b border-outline-variant font-label-md text-on-surface-variant">
                                        <th className="py-4 px-6 font-medium">Tên</th>
                                        <th className="py-4 px-6 font-medium">Đã chia sẻ với</th>
                                        <th className="py-4 px-6 font-medium">Ngày chia sẻ</th>
                                        <th className="py-4 px-6 font-medium text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="font-body-md text-on-surface">
                                    {sharedItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-outline-variant hover:bg-surface-bright transition-colors group last:border-b-0"
                                        >
                                            {/* Tên File/Folder */}
                                            <td className="py-4 px-6 flex items-center gap-3">
                                                {item.icon}
                                                <span className="font-medium text-on-surface">{item.name}</span>
                                            </td>

                                            {/* Đối tượng chia sẻ */}
                                            <td className="py-4 px-6">
                                                {item.shareMode === 'public' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-fixed text-primary-fixed-variant">
                                                        <Globe size={14} />
                                                        Công khai
                                                    </span>
                                                ) : (
                                                    <div className="flex -space-x-2">
                                                        {item.avatars?.map((avatar, index) => (
                                                            <img
                                                                key={index}
                                                                alt="Avatar"
                                                                className="w-8 h-8 rounded-full border-2 border-surface object-cover bg-surface-variant"
                                                                src={avatar}
                                                            />
                                                        ))}
                                                        {item.extraUsersCount && (
                                                            <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-xs font-medium text-on-surface-variant z-10">
                                                                +{item.extraUsersCount}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Ngày chia sẻ */}
                                            <td className="py-4 px-6 text-on-surface-variant">
                                                {item.date}
                                            </td>

                                            {/* Thao tác (Chỉ hiện khi hover) */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
                                                        title="Sao chép liên kết"
                                                    >
                                                        <Link size={20} />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
                                                        title="Quản lý quyền truy cập"
                                                    >
                                                        <UserCog size={20} />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-error-container hover:text-error rounded-lg text-on-surface-variant transition-colors"
                                                        title="Dừng chia sẻ"
                                                    >
                                                        <Ban size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default SharedPage;