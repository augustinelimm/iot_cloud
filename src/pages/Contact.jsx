import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "", 
    message: ""
  });

  const contactInfo = [
    { title: "Email", content: "support@smartlaundry.com" },
    { title: "Phone", content: "+1 (555) 123-4567" },
    { title: "Address", content: "123 Smart Home Ave, Tech City, TC 12345" }
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
    <div className="bg-white w-full min-h-screen relative">
      
      <main className="bg-gray-100 min-h-screen pt-16 pb-8">
        <div className="max-w-md mx-auto px-6 space-y-6">
          <h1 className="text-center text-xl font-normal text-gray-900">Contact Us</h1>
          
          {/* Contact Info */}
          <section className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-5 h-5 bg-gray-300 rounded mt-1"></div>
                <div>
                  <h3 className="font-medium text-gray-900">{info.title}</h3>
                  <p className="text-gray-600">{info.content}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Contact Form */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-gray-900 text-base mb-6">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-green-500 focus:outline-none"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-green-500 focus:outline-none"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-green-500 focus:outline-none resize-none"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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