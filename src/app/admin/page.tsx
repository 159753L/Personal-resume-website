"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
      title: "图像识别系统",
      description: "使用深度学习技术实现的图像识别系统，准确率达到98%以上。",
      tech: ["Python", "TensorFlow", "CNN"],
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Image%20recognition%20system%20dashboard%2C%20futuristic%20design%2C%20dark%20theme%2C%20green%20accent%20colors&image_size=square_hd"
    },
    {
      title: "智能推荐系统",
      description: "基于协同过滤和内容过滤的混合推荐系统，提高用户体验。",
      tech: ["Python", "Scikit-learn", "FastAPI"],
      image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Smart%20recommendation%20system%20interface%2C%20futuristic%20design%2C%20dark%20theme%2C%20purple%20accent%20colors&image_size=square_hd"
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
    { category: "Prompt Engineering", items: ["System Prompts", "Few-shot Learning", "Chain-of-Thought"] },
    { category: "Development", items: ["Cursor", "Claude 3.5 Sonnet", "LangChain"] },
    { category: "Efficiency", items: ["AI Automation", "Code Generation", "Documentation"] }
  ]
};

// 从localStorage加载数据
const loadData = (): WebsiteData => {
  try {
    // 仅在客户端使用localStorage
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('websiteData');
      return savedData ? JSON.parse(savedData) : defaultData;
    }
    return defaultData;
  } catch (error) {
    console.error('加载数据失败:', error);
    return defaultData;
  }
};

// 保存数据到localStorage
const saveData = (data: WebsiteData) => {
  try {
    // 仅在客户端使用localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('websiteData', JSON.stringify(data));
    }
  } catch (error) {
    console.error('保存数据失败:', error);
  }
};

export default function AdminPage() {
  // 加载数据
  const [data, setData] = useState<WebsiteData>(loadData());
  const [isSaving, setIsSaving] = useState(false);

  // 保存数据
  const handleSave = () => {
    setIsSaving(true);
    saveData(data);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  // 重置数据
  const handleReset = () => {
    setData(defaultData);
    saveData(defaultData);
  };

  // 关于我编辑
  const handleAboutMeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prev => ({ ...prev, aboutMe: e.target.value }));
  };

  // 技能编辑
  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    const updatedSkills = [...data.skills];
    if (field === 'percentage') {
      updatedSkills[index][field] = parseInt(value) || 0;
    } else {
      updatedSkills[index][field] = value;
    }
    setData(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleAddSkill = () => {
    setData(prev => ({ 
      ...prev, 
      skills: [...prev.skills, { name: "新技能", percentage: 0 }] 
    }));
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = data.skills.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, skills: updatedSkills }));
  };

  // 项目编辑
  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
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
    updatedProjects[projectIndex].tech.push("新技术");
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
          title: "新项目",
          description: "项目描述...",
          tech: ["技术1", "技术2"],
          image: "https://via.placeholder.com/800x450"
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
    updatedTools[categoryIndex].items.push("新工具");
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
        { category: "新分类", items: ["新工具"] }
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary flex items-center">
            <span className="text-4xl mr-2">⚙️</span>
            网站后台管理
          </h1>
          <p className="text-muted mb-6">在这里编辑您的网站内容，更改会实时保存并显示在前端页面上。</p>
        </motion.div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-full font-medium ${isSaving ? 'bg-gray-600' : 'bg-primary text-white hover:bg-primary/80'}`}
          >
            {isSaving ? '💾 保存中...' : '💾 保存更改'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-6 py-2 rounded-full font-medium bg-secondary text-white hover:bg-secondary/80"
          >
            🔄 重置为默认值
          </motion.button>
        </div>

        {/* 关于我编辑 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg"
        >
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const result = event.target?.result as string;
                        const updatedData = { ...data, profilePhoto: result };
                        setData(updatedData);
                        saveData(updatedData);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="profilePhotoInput"
                />
                <label 
                  htmlFor="profilePhotoInput"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 cursor-pointer inline-block"
                >
                  📸 上传新照片
                </label>
                <p className="text-xs text-muted mt-1">支持JPG、PNG、WebP格式</p>
              </div>
            </div>
          </div>
          
          <textarea
            value={data.aboutMe}
            onChange={handleAboutMeChange}
            className="w-full bg-gray-700 border border-primary/50 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            placeholder="编辑您的个人简介..."
          />
        </motion.div>

        {/* 技能编辑 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-secondary">核心技能</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddSkill}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm"
            >
              ➕ 添加技能
            </motion.button>
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveSkill(index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ 删除
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI工具栈编辑 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-secondary">AI工具栈</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddAIToolCategory}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm"
            >
              ➕ 添加分类
            </motion.button>
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveAIToolCategory(categoryIndex)}
                    className="ml-4 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ 删除分类
                  </motion.button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">工具列表</div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddAIToolItem(categoryIndex)}
                      className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/80 text-xs"
                    >
                      ➕ 添加工具
                    </motion.button>
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
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveAIToolItem(categoryIndex, itemIndex)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          🗑️
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 项目编辑 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12 bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-secondary">项目管理</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddProject}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 text-sm"
            >
              ➕ 添加项目
            </motion.button>
          </div>
          <div className="space-y-6">
            {data.projects.map((project, projectIndex) => (
              <div key={projectIndex} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-primary">项目 {projectIndex + 1}</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemoveProject(projectIndex)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                  >
                    🗑️ 删除项目
                  </motion.button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">项目标题</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => handleProjectChange(projectIndex, 'title', e.target.value)}
                      className="w-full bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="项目标题"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">项目描述</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => handleProjectChange(projectIndex, 'description', e.target.value)}
                      className="w-full bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                      placeholder="项目描述"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">项目图片URL</label>
                    <input
                      type="text"
                      value={project.image}
                      onChange={(e) => handleProjectChange(projectIndex, 'image', e.target.value)}
                      className="w-full bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="项目图片URL"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="block text-sm font-medium">技术栈</label>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddProjectTech(projectIndex)}
                        className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/80 text-xs"
                      >
                        ➕ 添加技术
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <div key={techIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={tech}
                            onChange={(e) => handleProjectTechChange(projectIndex, techIndex, e.target.value)}
                            className="bg-gray-600 border border-primary/50 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="技术名称"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRemoveProjectTech(projectIndex, techIndex)}
                            className="px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                          >
                            🗑️
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-muted text-sm mt-12"
        >
          <p>🔗 <a href="/" className="text-primary hover:underline">查看前端页面</a></p>
          <p className="mt-2">© 2026 网站后台管理系统</p>
        </motion.div>
      </div>
    </div>
  );
}