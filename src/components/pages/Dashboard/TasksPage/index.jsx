import { Card } from 'antd'; // Import Card component

export default function TasksPage() {
    return (
        <div className="p-4"> {/* Thêm padding cho nội dung chung */}
            <Card
                title="Tasks"
                className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
                headStyle={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0' }}
            >
                <p className="text-gray-700 leading-relaxed">Danh sách các công việc của bạn sẽ hiển thị ở đây</p>
            </Card>
        </div>
    );
}