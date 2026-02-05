"use client";
import React, { useEffect, useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

// 客户端粒子效果组件
const ClientParticles = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          key={index}
          className="absolute w-1 h-1 bg-primary/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.5,
          }}
        />
      ))}
    </>
  );
};

// 光标跟随组件
const CursorFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed w-4 h-4 bg-primary/30 rounded-full pointer-events-none z-50"
      style={{
        left: `${position.x - 8}px`,
        top: `${position.y - 8}px`,
      }}
    />
  );
};

// 定义数据类型
interface Skill {
  name: string;
  percentage: number;
}

interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
}

interface AITool {
  category: string;
  items: string[];
}

interface WebsiteData {
  aboutMe: string;
  profilePhoto: string;
  skills: Skill[];
  projects: Project[];
  aiTools: AITool[];
}

// 默认数据
const defaultData: WebsiteData = {
  aboutMe: "作为一名AI开发者，我专注于构建智能、高效的AI解决方案。我热爱探索前沿技术，并将其应用于实际问题中。",
  profilePhoto: "/profile_photo.jpg",
  skills: [
    { name: "Python", percentage: 95 },
    { name: "JavaScript", percentage: 92 },
    { name: "React", percentage: 90 },
    { name: "Node.js", percentage: 88 },
    { name: "TensorFlow", percentage: 93 },
    { name: "PyTorch", percentage: 91 },
    { name: "LangChain", percentage: 85 }
  ],
  projects: [
    {
      title: "AI聊天机器人",
      description: "基于GPT-4的智能聊天机器人，具有多轮对话能力和上下文理解能力。",
      tech: ["React", "Node.js", "OpenAI API"],
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chatbot%20interface%20with%20futuristic%20design%2C%20dark%20theme%2C%20blue%20accent%20colors&image_size=square_hd"
    },
    {
      title: "图像生成应用",
      description: "使用Stable Diffusion API开发的图像生成应用，支持多种风格和参数调整。",
      tech: ["Next.js", "Stable Diffusion API", "Tailwind CSS"],
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Image%20generation%20application%20with%20futuristic%20UI%2C%20dark%20theme%2C%20purple%20accent%20colors&image_size=square_hd"
    },
    {
      title: "语音助手应用",
      description: "基于深度学习的语音识别和自然语言处理应用，支持语音命令和实时翻译功能。",
      tech: ["Python", "PyTorch", "Librosa", "Flask"],
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Voice%20assistant%20application%20interface%2C%20futuristic%20design%2C%20dark%20theme%2C%20orange%20accent%20colors&image_size=square_hd"
    },
    {
      title: "自动驾驶模拟系统",
      description: "基于强化学习的自动驾驶模拟环境，用于训练和测试自动驾驶算法。",
      tech: ["Python", "Unity", "PyTorch", "OpenCV"],
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Autonomous%20driving%20simulation%20system%2C%20futuristic%20car%2C%20dark%20theme%2C%20red%20accent%20colors&image_size=square_hd"
    }
  ],
  aiTools: [
    {
      category: "AI语言模型",
      items: ["GPT-4o", "Claude 3.5", "Gemini Advanced", "Anthropic Claude 3"]
    },
    {
      category: "AI代码助手",
      items: ["GitHub Copilot", "Cursor", "Codeium", "Sourcegraph Cody"]
    },
    {
      category: "AI图像生成",
      items: ["Midjourney", "DALL-E 3", "Stable Diffusion", "Leonardo AI"]
    },
    {
      category: "AI视频生成",
      items: ["Runway Gen-2", "Pika Labs", "Synthesia", "Hour One"]
    }
  ]
};

const HomePage: React.FC = () => {
  const [data, setData] = useState<WebsiteData>(defaultData);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // 从localStorage加载数据
  useEffect(() => {
    const savedData = localStorage.getItem('websiteData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved data:', error);
      }
    }
  }, []);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 生成PDF简历
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // 添加个人信息
    doc.text('个人简历', 105, 20, { align: 'center' });
    doc.text(`关于我: ${data.aboutMe}`, 20, 40);
    
    // 添加技能
    doc.text('技能', 20, 60);
    data.skills.forEach((skill, index) => {
      doc.text(`${skill.name}: ${skill.percentage}%`, 30, 70 + (index * 10));
    });
    
    // 添加项目
    doc.text('项目', 20, 120);
    data.projects.forEach((project, index) => {
      doc.text(`${project.title}: ${project.description}`, 30, 130 + (index * 20));
      doc.text(`技术栈: ${project.tech.join(', ')}`, 40, 140 + (index * 20));
    });
    
    // 保存PDF
    doc.save('resume.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* 粒子效果 */}
      <ClientParticles />
      
      {/* 光标跟随 */}
      <CursorFollower />
      
      {/* 头部导航 */}
      <div 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">AI开发者</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="text-muted hover:text-primary transition-colors">关于我</a>
            <a href="#skills" className="text-muted hover:text-primary transition-colors">技能</a>
            <a href="#projects" className="text-muted hover:text-primary transition-colors">项目</a>
            <a href="#ai-tools" className="text-muted hover:text-primary transition-colors">AI工具栈</a>
          </nav>
          <button 
            onClick={generatePDF}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
          >
            📄 下载简历
          </button>
        </div>
      </div>
      
      {/* 主内容 */}
      <main className="pt-24">
        {/* 英雄区域 */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4">
          <div className="container mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="aspect-square w-32 md:w-48 bg-gray-800 rounded-full overflow-hidden mx-auto">
                <img 
                  src={data.profilePhoto} 
                  alt="个人照片" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-primary">AI</span> 开发者
            </h1>
            <p className="text-xl md:text-2xl text-muted mb-12 max-w-3xl mx-auto">
              {data.aboutMe}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#projects"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                查看项目
              </a>
              <a 
                href="#skills"
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                了解技能
              </a>
            </div>
          </div>
        </section>
        
        {/* 关于我 */}
        <section id="about" className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">关于我</h2>
            <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
              <p className="text-lg text-muted leading-relaxed">
                {data.aboutMe}
              </p>
            </div>
          </div>
        </section>
        
        {/* 技能 */}
        <section id="skills" className="py-20 px-4 bg-gray-850">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">技能</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.skills.map((skill, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium">{skill.name}</span>
                    <span className="text-primary">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 项目 */}
        <section id="projects" className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  <div className="aspect-video bg-gray-700">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-primary">{project.title}</h3>
                    <p className="text-muted mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-gray-700 rounded-full text-sm">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* AI工具栈 */}
        <section id="ai-tools" className="py-20 px-4 bg-gray-850">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">AI工具栈</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.aiTools.map((tool, index) => (
                <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-secondary">{tool.category}</h3>
                  <ul className="space-y-2">
                    {tool.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2">
                        <span className="text-primary">•</span>
                        <span className="text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 页脚 */}
        <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto max-w-5xl text-center">
            <p className="text-muted mb-6">© 2024 AI开发者. 保留所有权利.</p>
            <div className="flex justify-center gap-6">
              <a href="#" className="text-muted hover:text-primary transition-colors">GitHub</a>
              <a href="#" className="text-muted hover:text-primary transition-colors">LinkedIn</a>
              <a href="#" className="text-muted hover:text-primary transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;