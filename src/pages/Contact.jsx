import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    message: ""
  });

  const contactInfo = [
    { 
      title: "Email", 
      content: "support@smartlaundry.com",
      icon: Mail,
      iconColor: "text-lime-500"
    },
    { 
      title: "Phone", 
      content: "+1 (555) 123-4567",
      icon: Phone,
      iconColor: "text-lime-500"
    },
    { 
      title: "Address", 
      content: "123 Smart Home Ave, Tech City, TC 12345",
      icon: MapPin,
      iconColor: "text-lime-500"
    }
  ];

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-gray-50 w-full min-h-screen">
      <main className="min-h-screen py-8">
        <div className="max-w-lg mx-auto px-6 space-y-6">
          <h1 className="text-center text-2xl font-normal text-gray-900 mb-8">Contact Us</h1>
          
          {/* Contact Info */}
          <section className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <IconComponent className={`w-6 h-6 ${info.iconColor} mt-1`} />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                    <p className="text-gray-600">{info.content}</p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* Contact Form */}
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-gray-900 text-lg font-normal mb-6">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-900 font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-900 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-900 font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 resize-none transition-colors"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors font-medium"
              >
                Send Message
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Contact;