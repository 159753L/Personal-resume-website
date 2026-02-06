"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
        <motion.div
          key={index}
          className="absolute w-1 h-1 bg-primary/50 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
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
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="cursor-follow"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

// 打字机效果组件
const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState<string>('');

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className="typewriter animate-typewriter">
      {displayedText}
      <span className="animate-blink-caret border-r-4 border-primary ml-1"></span>
    </span>
  );
};

// 项目卡片组件
const ProjectCard = ({ 
  title, 
  description, 
  tech, 
  image 
}: { 
  title: string; 
  description: string; 
  tech: string[]; 
  image: string; 
}) => {
  return (
    <motion.div 
      className="project-card relative"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="aspect-video bg-surface rounded-xl overflow-hidden mb-4">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
      <p className="text-muted mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map((item, index) => (
          <span key={index} className="tech-badge">{item}</span>
        ))}
      </div>
      <div className="project-overlay">
        <button className="btn-primary mt-4">查看详情</button>
      </div>
    </motion.div>
  );
};

// 可编辑AI工具栈组件
const EditableAIToolStack = ({ tools, onChange, isEditMode }: { tools: { category: string; items: string[] }[]; onChange: (tools: { category: string; items: string[] }[]) => void; isEditMode: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTools, setEditTools] = useState(tools);
  const [newCategory, setNewCategory] = useState("");
  const [newItem, setNewItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setEditTools(prev => [...prev, { category: newCategory.trim(), items: [] }]);
      setNewCategory("");
    }
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      const categoryIndex = parseInt(selectedCategory);
      if (categoryIndex >= 0 && categoryIndex < editTools.length) {
        const updatedTools = [...editTools];
        updatedTools[categoryIndex].items.push(newItem.trim());
        setEditTools(updatedTools);
        setNewItem("");
      }
    }
  };

  const handleRemoveItem = (categoryIndex: number, itemIndex: number) => {
    const updatedTools = [...editTools];
    updatedTools[categoryIndex].items.splice(itemIndex, 1);
    setEditTools(updatedTools);
  };

  const handleRemoveCategory = (categoryIndex: number) => {
    const updatedTools = editTools.filter((_, index) => index !== categoryIndex);
    setEditTools(updatedTools);
    if (parseInt(selectedCategory) === categoryIndex) {
      setSelectedCategory(updatedTools.length > 0 ? "0" : "-1");
    } else if (parseInt(selectedCategory) > categoryIndex) {
      setSelectedCategory((parseInt(selectedCategory) - 1).toString());
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange(editTools);
  };

  const handleCategoryChange = (categoryIndex: number, newCategoryName: string) => {
    const updatedTools = [...editTools];
    updatedTools[categoryIndex].category = newCategoryName;
    setEditTools(updatedTools);
  };

  const handleEditClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  return (
    <div className="bento-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-secondary">我的AI生产力引擎</h3>
        {isEditMode && !isEditing && (
          <button
            onClick={handleEditClick}
            className="btn-primary text-sm px-3 py-1"
          >
            编辑工具栈
          </button>
        )}
        {isEditing && (
          <button
            onClick={handleSave}
            className="btn-primary text-sm px-3 py-1"
          >
            保存
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {isEditing ? (
          <>
            {editTools.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-primary/20 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={category.category}
                    onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
                    className="text-lg font-semibold text-primary bg-surface border border-primary/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => handleRemoveCategory(categoryIndex)}
                    className="text-xs text-muted hover:text-primary"
                  >
                    删除分类
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {category.items.map((item, itemIndex) => (
                    <span key={itemIndex} className="tech-badge relative pr-4">
                      {item}
                      <button
                        onClick={() => handleRemoveItem(categoryIndex, itemIndex)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-muted hover:text-primary"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="border border-dashed border-primary/50 rounded p-3">
              <h4 className="text-lg font-semibold mb-2 text-primary">添加新分类</h4>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="分类名称"
                  className="flex-1 bg-surface border border-primary/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleAddCategory}
                  className="btn-primary text-sm px-3 py-1"
                >
                  添加分类
                </button>
              </div>
              
              <h4 className="text-lg font-semibold mb-2 text-primary">添加新工具</h4>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-surface border border-primary/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {editTools.map((category, index) => (
                    <option key={index} value={index}>{category.category}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="工具名称"
                  className="flex-1 bg-surface border border-primary/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleAddItem}
                  className="btn-primary text-sm px-3 py-1"
                >
                  添加工具
                </button>
              </div>
            </div>
          </>
        ) : (
          editTools.map((category, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-2 text-primary">{category.category}</h4>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item, itemIndex) => (
                  <span key={itemIndex} className="tech-badge">{item}</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// AI助手组件
const AIAssistant = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div 
        className="bg-surface rounded-full w-16 h-16 flex items-center justify-center cursor-pointer border-2 border-primary shadow-lg shadow-primary/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-2xl text-primary">🤖</span>
      </motion.div>
      <div className="absolute bottom-full right-0 mb-2 bg-surface rounded-lg px-3 py-1 text-sm border border-primary/50">
        关于我的AI助手
      </div>
    </div>
  );
};

// PDF简历生成按钮组件
const PDFGenerator = ({ data }: { data: WebsiteData }) => {
  const generatePDF = () => {
    // 创建一个隐藏的HTML元素来构建简历内容
    const resumeHTML = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>个人简历</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Microsoft YaHei', sans-serif;
          }
          
          .resume-container {
            display: flex;
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            overflow: hidden;
          }
          
          .left-column {
            width: 80mm;
            height: 100%;
            background-color: #2980b9;
            color: white;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .right-column {
            width: 130mm;
            height: 100%;
            padding: 20px;
            background-color: white;
            color: black;
          }
          
          .profile-photo {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-top: 20px;
            object-fit: cover;
          }
          
          .name {
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
            text-align: center;
          }
          
          .title {
            font-size: 14px;
            margin-top: 5px;
            text-align: center;
          }
          
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-top: 30px;
            text-align: center;
            border-bottom: 1px solid white;
            padding-bottom: 5px;
            width: 100%;
          }
          
          .contact-info {
            margin-top: 20px;
            width: 100%;
            font-size: 12px;
          }
          
          .contact-info p {
            margin-bottom: 10px;
          }
          
          .skills-list {
            margin-top: 20px;
            width: 100%;
            font-size: 12px;
          }
          
          .skills-list ul {
            list-style-type: disc;
            margin-left: 20px;
          }
          
          .skills-list li {
            margin-bottom: 5px;
          }
          
          .right-section {
            margin-bottom: 30px;
          }
          
          .right-section h2 {
            font-size: 18px;
            color: #2980b9;
            margin-bottom: 15px;
            border-bottom: 2px solid #2980b9;
            padding-bottom: 5px;
          }
          
          .about-me {
            font-size: 14px;
            line-height: 1.5;
          }
          
          .skill-bar {
            margin-bottom: 15px;
          }
          
          .skill-bar .skill-name {
            font-size: 14px;
            margin-bottom: 5px;
          }
          
          .skill-bar .skill-progress {
            width: 100%;
            height: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
          }
          
          .skill-bar .skill-progress .progress {
            height: 100%;
            background-color: #2980b9;
            border-radius: 5px;
          }
          
          .project {
            margin-bottom: 20px;
          }
          
          .project h3 {
            font-size: 16px;
            margin-bottom: 5px;
          }
          
          .project .description {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 5px;
          }
          
          .project .tech-stack {
            font-size: 13px;
            color: #2980b9;
          }
          
          .ai-tool {
            margin-bottom: 15px;
          }
          
          .ai-tool h3 {
            font-size: 16px;
            color: #2980b9;
            margin-bottom: 5px;
          }
          
          .ai-tool .tools {
            font-size: 14px;
            line-height: 1.5;
          }
          
          .footer {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="resume-container">
          <!-- 左侧栏 -->
          <div class="left-column">
            ${data.profilePhoto && data.profilePhoto !== '/profile_photo.jpg' ? `<img class="profile-photo" src="${data.profilePhoto}" alt="个人照片">` : ''}
            <div class="name">AI开发者</div>
            <div class="title">全栈开发者 & AI工程师</div>
            
            <div class="section-title">联系方式</div>
            <div class="contact-info">
              <p>邮箱: example@example.com</p>
              <p>电话: 123-456-7890</p>
              <p>地址: 中国 北京</p>
              <p>GitHub: github.com/username</p>
              <p>LinkedIn: linkedin.com/in/username</p>
            </div>
            
            <div class="section-title">专业技能</div>
            <div class="skills-list">
              <ul>
                ${Array.from(new Set([...data.skills.map(s => s.name), ...data.aiTools.flatMap(t => t.items)]))
                  .slice(0, 15)
                  .map(skill => `<li>${skill}</li>`)
                  .join('')}
              </ul>
            </div>
          </div>
          
          <!-- 右侧栏 -->
          <div class="right-column">
            <div class="right-section">
              <h2>个人简介</h2>
              <div class="about-me">${data.aboutMe}</div>
            </div>
            
            <div class="right-section">
              <h2>核心技能</h2>
              ${data.skills.map(skill => `
                <div class="skill-bar">
                  <div class="skill-name">${skill.name}: ${skill.percentage}%</div>
                  <div class="skill-progress">
                    <div class="progress" style="width: ${skill.percentage}%"></div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="right-section">
              <h2>精选项目</h2>
              ${data.projects.map((project, index) => `
                <div class="project">
                  <h3>${index + 1}. ${project.title}</h3>
                  <div class="description">${project.description}</div>
                  <div class="tech-stack">技术栈: ${project.tech.join(', ')}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="right-section">
              <h2>AI工具栈</h2>
              ${data.aiTools.map(tool => `
                <div class="ai-tool">
                  <h3>${tool.category}</h3>
                  <div class="tools">${tool.items.join(', ')}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="footer">
              生成日期: ${new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // 创建一个临时的iframe来生成PDF
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(resumeHTML);
      iframeDoc.close();
      
      // 使用浏览器的打印功能生成PDF
      setTimeout(() => {
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow) {
          iframeWindow.print();
          // 移除临时iframe
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }
      }, 500);
    }
  };

  return (
    <motion.button 
      className="btn-secondary fixed top-6 right-6 z-40"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={generatePDF}
    >
      📄 生成简历PDF
    </motion.button>
  );
};

// 可编辑文本组件
const EditableText = ({ value, onChange, className = "", placeholder = "编辑文本", isEditMode }: { value: string; onChange: (value: string) => void; className?: string; placeholder?: string; isEditMode: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(editValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        className={`bg-surface border border-primary/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
      />
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className={`${isEditMode ? 'cursor-pointer' : ''} ${className}`}
    >
      {value || placeholder}
    </span>
  );
};

// 可编辑技能组件
const EditableSkill = ({ skill, percentage, onChange, isEditMode }: { skill: string; percentage: number; onChange: (skill: string, percentage: number) => void; isEditMode: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editSkill, setEditSkill] = useState(skill);
  const [editPercentage, setEditPercentage] = useState(percentage.toString());

  const handleSave = () => {
    setIsEditing(false);
    onChange(editSkill, parseInt(editPercentage) || 0);
  };

  const handleEditClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editSkill}
              onChange={(e) => setEditSkill(e.target.value)}
              className="bg-surface border border-primary/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="number"
              value={editPercentage}
              onChange={(e) => setEditPercentage(e.target.value)}
              min="0"
              max="100"
              className="bg-surface border border-primary/50 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSave}
              className="btn-primary text-sm px-3 py-1"
            >
              保存
            </button>
          </div>
        ) : (
          <div className="flex justify-between w-full items-center">
            <EditableText value={skill} onChange={(value) => onChange(value, percentage)} className="text-muted" isEditMode={isEditMode} />
            <div className="flex items-center gap-2">
              <EditableText value={`${percentage}%`} onChange={(value) => onChange(skill, parseInt(value) || 0)} className="text-primary" isEditMode={isEditMode} />
              {isEditMode && (
                <button
                  onClick={handleEditClick}
                  className="text-xs text-primary hover:underline"
                >
                  编辑
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="w-full bg-surface rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        ></motion.div>
      </div>
    </div>
  );
};

// 可编辑项目组件
const EditableProjectCard = ({ project, index, onChange, isEditMode }: { project: { title: string; description: string; tech: string[]; image: string }; index: number; onChange: (index: number, project: { title: string; description: string; tech: string[]; image: string }) => void; isEditMode: boolean }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editProject, setEditProject] = useState({ ...project });
  const [newTech, setNewTech] = useState("");

  const handleAddTech = () => {
    if (newTech.trim()) {
      setEditProject(prev => ({ ...prev, tech: [...prev.tech, newTech.trim()] }));
      setNewTech("");
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setEditProject(prev => ({ ...prev, tech: prev.tech.filter(tech => tech !== techToRemove) }));
  };

  const handleSave = () => {
    setIsEditing(false);
    onChange(index, editProject);
  };

  const handleEditClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  return (
    <div className="project-card relative">
      <div className="aspect-video bg-surface rounded-xl overflow-hidden mb-4">
        <img
          src={editProject.image}
          alt={editProject.title}
          className="w-full h-full object-cover"
        />
      </div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editProject.title}
            onChange={(e) => setEditProject(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-surface border border-primary/50 rounded px-2 py-1 mb-2 text-xl font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={editProject.description}
            onChange={(e) => setEditProject(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-surface border border-primary/50 rounded px-2 py-1 mb-2 text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
          <div className="mb-2">
            <div className="flex flex-wrap gap-2 mb-1">
              {editProject.tech.map((tech, techIndex) => (
                <span key={techIndex} className="tech-badge relative pr-4">
                  {tech}
                  <button
                    onClick={() => handleRemoveTech(tech)}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xs text-muted hover:text-primary"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="添加技术..."
                className="flex-1 bg-surface border border-primary/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddTech}
                className="btn-primary text-sm px-3 py-1"
              >
                添加
              </button>
            </div>
          </div>
          <input
            type="text"
            value={editProject.image}
            onChange={(e) => setEditProject(prev => ({ ...prev, image: e.target.value }))}
            placeholder="图片URL"
            className="w-full bg-surface border border-primary/50 rounded px-2 py-1 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSave}
            className="btn-primary w-full"
          >
            保存
          </button>
        </div>
      ) : (
        <div>
          <EditableText value={editProject.title} onChange={(value) => setEditProject(prev => ({ ...prev, title: value }))} className="text-xl font-bold mb-2 text-primary" isEditMode={isEditMode} />
          <p className="text-muted mb-4">{editProject.description}</p>
          <div className="flex flex-wrap gap-2">
            {editProject.tech.map((item, index) => (
              <span key={index} className="tech-badge">{item}</span>
            ))}
          </div>
          {isEditMode && (
            <button
              onClick={handleEditClick}
              className="btn-primary mt-4 w-full"
            >
              编辑项目
            </button>
          )}
        </div>
      )}
    </div>
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

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  // 固定为查看模式，所有编辑在后台进行
  const isEditMode = false;

  // 加载数据
  const [data, setData] = useState<WebsiteData>(loadData);

  // 定期检查数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      const latestData = loadData();
      setData(latestData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 可编辑状态快捷访问
  const aboutMe = data.aboutMe;
  const skills = data.skills;
  const projects = data.projects;
  const aiTools = data.aiTools;

  // 处理技能更新
  const handleSkillChange = (oldSkill: string, newSkill: string, newPercentage: number) => {
    const updatedSkills = skills.map(skill => 
      skill.name === oldSkill 
        ? { ...skill, name: newSkill, percentage: newPercentage } 
        : skill
    );
    const updatedData = { ...data, skills: updatedSkills };
    setData(updatedData);
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
  };

  // 处理项目更新
  const handleProjectChange = (index: number, updatedProject: { title: string; description: string; tech: string[]; image: string }) => {
    const updatedProjects = projects.map((project, i) => 
      i === index ? updatedProject : project
    );
    const updatedData = { ...data, projects: updatedProjects };
    setData(updatedData);
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
  };

  return (
    <div className="min-h-screen">
      <CursorFollower />
      <PDFGenerator data={data} />
      <AIAssistant />
      


      {/* 英雄区域 */}
      <motion.section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-surface/80"></div>
          {/* 背景粒子效果 */}
          <ClientParticles />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">你好，我是</span> 
              <span className="glow-text">AI开发者</span>
            </h1>
            <p className="text-2xl md:text-3xl text-muted mb-8 max-w-3xl mx-auto">
              <TypewriterEffect text="专注于创建智能、高效的AI解决方案" />
            </p>
            <motion.button 
              className="btn-primary text-lg px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              探索我的作品
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-muted">向下滚动探索</span>
        </motion.div>
      </motion.section>

      {/* Bento Grid 区域 */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="section-title mb-12">
          <span className="text-white">我的</span> 
          <span className="glow-text">技术实验室</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 个人简介卡片 */}
          <motion.div 
            className="bento-card"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl overflow-hidden mb-4">
              <img src={data.profilePhoto} alt="个人照片" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-primary">关于我</h3>
            <EditableText 
              value={aboutMe} 
              onChange={(newAboutMe) => {
                const updatedData = { ...data, aboutMe: newAboutMe };
                setData(updatedData);
                localStorage.setItem('websiteData', JSON.stringify(updatedData));
              }} 
              className="text-muted whitespace-pre-line"
              placeholder="编辑个人简介..."
              isEditMode={isEditMode}
            />
          </motion.div>

          {/* AI工具栈卡片 */}
          <motion.div 
            className="bento-card lg:col-span-2"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <EditableAIToolStack 
              tools={aiTools} 
              onChange={(newTools) => {
                const updatedData = { ...data, aiTools: newTools };
                setData(updatedData);
                localStorage.setItem('websiteData', JSON.stringify(updatedData));
              }} 
              isEditMode={isEditMode} 
            />
          </motion.div>

          {/* 技能卡片 */}
          <motion.div 
            className="bento-card"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-xl font-bold mb-4 text-secondary">核心技能</h3>
            <div className="space-y-3">
              {skills.map((skillItem, index) => (
                <EditableSkill
                  key={index}
                  skill={skillItem.name}
                  percentage={skillItem.percentage}
                  onChange={(newSkill, newPercentage) => handleSkillChange(skillItem.name, newSkill, newPercentage)}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </motion.div>

          {/* 项目卡片 */}
          <motion.div 
            className="bento-card lg:col-span-2"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-xl font-bold mb-4 text-secondary">精选项目</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project, index) => (
                <EditableProjectCard key={index} project={project} index={index} onChange={handleProjectChange} isEditMode={isEditMode} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 项目案例研究区域 */}
      <section className="py-20 bg-surface/50">
        <div className="container mx-auto px-4">
          <h2 className="section-title mb-12">
            <span className="text-white">项目</span> 
            <span className="glow-text">案例研究</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                className="bento-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="aspect-video bg-surface rounded-xl overflow-hidden mb-4">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <EditableText value={project.title} onChange={(value) => handleProjectChange(index, { ...project, title: value })} className="text-xl font-bold mb-2 text-primary" isEditMode={isEditMode} />
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-secondary">痛点</h4>
                    <p className="text-muted">需要一个智能的解决方案来处理用户查询，提高响应速度和准确性。</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-secondary">解决方案</h4>
                    <p className="text-muted">使用GPT-4模型和LangChain框架，构建了一个具有上下文理解能力的聊天机器人。</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-secondary">成果</h4>
                    <p className="text-muted">提高了用户满意度，减少了人工客服的工作量，响应时间缩短了80%。</p>
                  </div>
                </div>
                <button className="btn-primary mt-6">查看完整案例</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 联系部分 */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2 className="section-title mb-8">
          <span className="text-white">与我</span> 
          <span className="glow-text">联系</span>
        </h2>
        <p className="text-muted text-xl mb-12 max-w-2xl mx-auto">
          如果您对我的作品感兴趣，或者想了解更多关于我如何使用AI解决问题的信息，请随时与我联系。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button 
            className="btn-primary px-8 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            发送邮件
          </motion.button>
          <motion.button 
            className="btn-secondary px-8 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            查看GitHub
          </motion.button>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-10 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-muted">
          <p>© 2026 AI开发者. 保留所有权利.</p>
          <p className="mt-2 text-sm">使用Next.js、Tailwind CSS和Framer Motion构建</p>
        </div>
      </footer>
    </div>
  );
}
