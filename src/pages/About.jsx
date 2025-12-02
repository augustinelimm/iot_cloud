const About = () => {
  const contentSections = [
    {
      title: "Smart Laundry Monitoring",
      content: "Our IoT-powered laundry monitoring system helps you keep track of your washing machines in real-time."
    },
    {
      title: "How It Works", 
      content: "Sensors detect cycle phases and predict completion times with high accuracy."
    },
    {
      title: "Our Mission",
      content: "We're committed to making everyday tasks more convenient through smart technology."
    }
  ];

  return (
    <main className="bg-gray-50 min-h-screen pt-16 pb-8">
      <div className="max-w-md mx-auto px-6">
        <h1 className="text-center text-xl font-normal text-gray-900 mb-6">About Us</h1>
        
        <div className="p-6 space-y-6">
          {contentSections.map((section, index) => (
            <section key={index} className="space-y-3">
              <h2 className="font-medium text-gray-900 text-lg">{section.title}</h2>
              <p className="text-gray-600 text-base leading-6">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
};

export default About;