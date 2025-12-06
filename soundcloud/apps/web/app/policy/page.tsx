// pages/Contact.tsx
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-100">
      
      {/* Contact Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Liên hệ với chúng tôi</h1>
        <p className="text-gray-600 mb-8">
          Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn. Hãy gửi tin nhắn hoặc liên hệ trực tiếp qua các kênh dưới đây.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
             <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Mail className="w-5 h-5"/>
             </div>
             <div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-gray-500">support@soundwave.vn</p>
                <p className="text-gray-500">partners@soundwave.vn</p>
             </div>
          </div>
          
          <div className="flex items-start gap-4">
             <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Phone className="w-5 h-5"/>
             </div>
             <div>
                <h3 className="font-bold text-gray-900">Hotline</h3>
                <p className="text-gray-500">1900 1234 (8:00 - 18:00)</p>
             </div>
          </div>

          <div className="flex items-start gap-4">
             <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <MapPin className="w-5 h-5"/>
             </div>
             <div>
                <h3 className="font-bold text-gray-900">Văn phòng</h3>
                <p className="text-gray-500">Tầng 12, Tòa nhà TechHub, TP.HCM</p>
             </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-gray-50 p-8 rounded-xl">
        <form className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" placeholder="Nhập tên của bạn" />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" placeholder="name@example.com" />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white">
                 <option>Hỗ trợ kỹ thuật</option>
                 <option>Vấn đề bản quyền</option>
                 <option>Hợp tác nghệ sĩ</option>
                 <option>Khác</option>
              </select>
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none" placeholder="Chi tiết vấn đề..."></textarea>
           </div>
           <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors">
              Gửi tin nhắn
           </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;