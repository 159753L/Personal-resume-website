"use client";
import React, { useState, useEffect } from 'react';

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

const AdminPage: React.FC = () => {
  const [data, setData] = useState<WebsiteData>(defaultData);
  const [isSaving, setIsSaving] = useState(false);

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

  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem('websiteData', JSON.stringify(data));
  }, [data]);

  // 保存更改
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 这里可以添加API调用保存到服务器
      console.log('Data saved successfully:', data);
      alert('保存成功！');
    } catch (error) {
      console.error('Failed to save data:', error);
      alert('保存失败，请重试！');
    } finally {
      setIsSaving(false);
    }
  };

  // 重置为默认值
  const handleReset = () => {
    if (window.confirm('确定要重置为默认值吗？所有更改将丢失。')) {
      setData(defaultData);
    }
  };

  // 关于我编辑
  const handleAboutMeChange = (value: string) => {
    setData(prev => ({ ...prev, aboutMe: value }));
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setData(prev => ({ ...prev, profilePhoto: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 技能编辑
  const handleSkillChange = (index: number, field: keyof Skill, value: string | number) => {
    const updatedSkills = [...data.skills];
    if (field === 'percentage') {
      updatedSkills[index][field] = Number(value);
    } else {
      updatedSkills[index][field] = value as string;
    }
    setData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleAddSkill = () => {
    setData(prev => ({ 
      ...prev, 
      skills: [...prev.skills, { name: '新技能', percentage: 0 }] 
    }));
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = data.skills.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, skills: updatedSkills }));
  };

  // 项目编辑
  const handleProjectChange = (index: number, field: keyof Omit<Project, 'tech'>, value: string) => {
    const updatedProjects = [...data.projects];
    updatedProjects[index][field] = value;
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const handleProjectTechChange = (projectIndex: number, techIndex: number, value: string) => {
    const updatedProjects = [...data.projects];
    updatedProjects[projectIndex].tech[techIndex] = value;
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const handleAddProjectTech = (projectIndex: number) => {
    const updatedProjects = [...data.projects];
    updatedProjects[projectIndex].tech.push('新技术');
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const handleRemoveProjectTech = (projectIndex: number, techIndex: number) => {
    const updatedProjects = [...data.projects];
    updatedProjects[projectIndex].tech = updatedProjects[projectIndex].tech.filter((_, i) => i !== techIndex);
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const handleAddProject = () => {
    setData(prev => ({ 
      ...prev, 
      projects: [
        ...prev.projects, 
        {
          title: '新项目',
          description: '项目描述...',
          tech: ['技术1', '技术2'],
          image: 'https://via.placeholder.com/800x450'
        }
      ] 
    }));
  };

  const handleRemoveProject = (index: number) => {
    const updatedProjects = data.projects.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, projects: updatedProjects }));
  };

  // AI工具编辑
  const handleAIToolCategoryChange = (index: number, value: string) => {
    const updatedTools = [...data.aiTools];
    updatedTools[index].category = value;
    setData(prev => ({ ...prev, aiTools: updatedTools }));
  };

  const handleAIToolItemChange = (categoryIndex: number, itemIndex: number, value: string) => {
    const updatedTools = [...data.aiTools];
    updatedTools[categoryIndex].items[itemIndex] = value;
    setData(prev => ({ ...prev, aiTools: updatedTools }));
  };

  const handleAddAIToolItem = (categoryIndex: number) => {
    const updatedTools = [...data.aiTools];
    updatedTools[categoryIndex].items.push('新工具');
    setData(prev => ({ ...prev, aiTools: updatedTools }));
  };

  const handleRemoveAIToolItem = (categoryIndex: number, itemIndex: number) => {
    const updatedTools = [...data.aiTools];
    updatedTools[categoryIndex].items = updatedTools[categoryIndex].items.filter((_, i) => i !== itemIndex);
    setData(prev => ({ ...prev, aiTools: updatedTools }));
  };

  const handleAddAIToolCategory = () => {
    setData(prev => ({ 
      ...prev, 
      aiTools: [
        ...prev.aiTools, 
        { category: '新分类', items: ['新工具'] }
      ] 
    }));
  };

  const handleRemoveAIToolCategory = (index: number) => {
    const updatedTools = data.aiTools.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, aiTools: updatedTools }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary flex items-center">
            <span className="text-4xl mr-2">⚙️</span>
            网站后台管理
          </h1>
          <p className="text-muted mb-6">在这里编辑您的网站内容，更改会实时保存并显示在前端页面上。</p>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-full font-medium ${isSaving ? 'bg-gray-600' : 'bg-primary text-white hover:bg-primary/80'}`}
          >
            {isSaving ? '💾 保存中...' : '💾 保存更改'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-full font-medium bg-secondary text-white hover:bg-secondary/80"
          >
            🔄 重置为默认值
          </button>
        </div>

        {/* 关于我编辑 */}
        <div className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-secondary">关于我</h2>
          
          {/* 照片上传部分 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">个人照片</h3>
            <div className="flex items-center gap-4">
              <div className="aspect-square w-32 bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={data.profilePhoto} 
                  alt="个人照片" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg cursor-pointer"
                />
                <p className="text-xs text-muted mt-1">支持JPG、PNG等图片格式</p>
              </div>
            </div>
          </div>

          {/* 关于我文本编辑 */}
          <div>
            <h3 className="text-lg font-medium mb-2">个人介绍</h3>
            <textarea
              value={data.aboutMe}
              onChange={(e) => handleAboutMeChange(e.target.value)}
              className="w-full h-40 bg-gray-700 border border-primary/50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="请输入您的个人介绍"
            />
          </div>
        </div>

        {/* 技能编辑 */}
        <div className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-secondary">技能</h2>
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm"
            >
              ➕ 添加技能
            </button>
          </div>
          <div className="space-y-4">
            {data.skills.map((skill, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium mb-1">技能名称</label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    className="w-full bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="技能名称"
                  />
                </div>
                <div className="w-[120px]">
                  <label className="block text-sm font-medium mb-1">熟练度 (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={skill.percentage}
                    onChange={(e) => handleSkillChange(index, 'percentage', e.target.value)}
                    className="w-full bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI工具栈编辑 */}
        <div className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-secondary">AI工具栈</h2>
            <button
              onClick={handleAddAIToolCategory}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm"
            >
              ➕ 添加分类
            </button>
          </div>
          <div className="space-y-6">
            {data.aiTools.map((tool, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">分类名称</label>
                    <input
                      type="text"
                      value={tool.category}
                      onChange={(e) => handleAIToolCategoryChange(categoryIndex, e.target.value)}
                      className="w-full bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="分类名称"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveAIToolCategory(categoryIndex)}
                    className="ml-4 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ 删除分类
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">工具列表</div>
                    <button
                      onClick={() => handleAddAIToolItem(categoryIndex)}
                      className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/80 text-xs"
                    >
                      ➕ 添加工具
                    </button>
                  </div>
                  <div className="space-y-2">
                    {tool.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleAIToolItemChange(categoryIndex, itemIndex, e.target.value)}
                          className="flex-1 bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="工具名称"
                        />
                        <button
                          onClick={() => handleRemoveAIToolItem(categoryIndex, itemIndex)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 项目编辑 */}
        <div className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-secondary">项目</h2>
            <button
              onClick={handleAddProject}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm"
            >
              ➕ 添加项目
            </button>
          </div>
          <div className="space-y-6">
            {data.projects.map((project, projectIndex) => (
              <div key={projectIndex} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">项目 {projectIndex + 1}</h3>
                  <button
                    onClick={() => handleRemoveProject(projectIndex)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ 删除项目
                  </button>
                </div>
                
                {/* 项目标题 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">项目标题</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectChange(projectIndex, 'title', e.target.value)}
                    className="w-full bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="项目标题"
                  />
                </div>
                
                {/* 项目描述 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">项目描述</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleProjectChange(projectIndex, 'description', e.target.value)}
                    className="w-full h-24 bg-gray-600 border border-primary/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="项目描述"
                  />
                </div>
                
                {/* 项目技术栈 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block text-sm font-medium">技术栈</label>
                    <button
                      onClick={() => handleAddProjectTech(projectIndex)}
                      className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/80 text-xs"
                    >
                      ➕ 添加技术
                    </button>
                  </div>
                  <div className="space-y-2">
                    {project.tech.map((tech, techIndex) => (
                      <div key={techIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={tech}
                          onChange={(e) => handleProjectTechChange(projectIndex, techIndex, e.target.value)}
                          className="flex-1 bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="技术名称"
                        />
                        <button
                          onClick={() => handleRemoveProjectTech(projectIndex, techIndex)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 项目图片 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">项目图片URL</label>
                  <input
                    type="text"
                    value={project.image}
                    onChange={(e) => handleProjectChange(projectIndex, 'image', e.target.value)}
                    className="w-full bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="图片URL"
                  />
                </div>
                
                {/* 图片预览 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">图片预览</label>
                  <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;