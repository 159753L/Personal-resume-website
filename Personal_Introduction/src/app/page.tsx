"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { jsPDF } from 'jspdf';

// 从data.ts导入数据和类型
import { defaultData, WebsiteData, Skill } from './data';

// 客户端粒子效果组件 - 修复hydration错误
const ClientParticles = () => {
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    setIsClient(true);
    // 仅在客户端生成随机粒子位置
    const newParticles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 bg-primary/50 rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </>
  );
};

// 客户端照片组件，解决hydration错误
const ClientProfilePhoto = ({ src, alt }: { src: string; alt: string }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // 服务端渲染时返回null
  }

  return (
    <img src={src} alt={alt} className="w-full h-full object-cover" />
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
const PDFGenerator = ({ data, toggleEditMode, isEditMode }: { data: WebsiteData; toggleEditMode: () => void; isEditMode: boolean }) => {
  const generatePDF = () => {
    // 直接使用已经优化好的resume.html模板
    const resumeHTML = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>李国琪 - AI产品经理简历</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            line-height: 1.3;
            color: #333;
            background-color: white;
            font-size: 13px;
          }
          
          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 10px 15px;
            background-color: white;
          }
          
          header {
            display: flex;
            align-items: center;
            padding-bottom: 8px;
            border-bottom: 2px solid #007bff;
            margin-bottom: 12px;
          }
          
          h1 {
            color: #007bff;
            font-size: 1.8em;
            margin: 0 0 3px 0;
          }
          
          .contact-info {
            font-size: 0.95em;
            color: #666;
            margin-bottom: 3px;
          }
          
          .contact-info span {
            margin: 0 8px 0 0;
          }
          
          section {
            margin-bottom: 12px;
          }
          
          h2 {
            color: #333;
            font-size: 1.3em;
            margin-bottom: 6px;
            padding-bottom: 2px;
            border-bottom: 1px solid #ddd;
          }
          
          .section-content {
            margin-left: 10px;
          }
          
          .item {
            margin-bottom: 8px;
          }
          
          .item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
          }
          
          .item-title {
            font-weight: bold;
            font-size: 1.05em;
            color: #007bff;
          }
          
          .item-date {
            color: #666;
            font-style: italic;
            font-size: 0.85em;
          }
          
          .item-company {
            font-weight: bold;
            margin-bottom: 2px;
            font-size: 0.95em;
          }
          
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          
          .skill-tag {
            background-color: #007bff;
            color: white;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 0.8em;
          }
          
          ul {
            list-style-type: disc;
            margin-left: 10px;
            padding-left: 8px;
          }
          
          li {
            margin-bottom: 2px;
            font-size: 0.9em;
          }
          
          @media print {
            body {
              background-color: white;
            }
            
            .container {
              box-shadow: none;
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header style="display: flex; align-items: center; padding-bottom: 20px; border-bottom: 2px solid #007bff;">
            <!-- 左侧照片区域 -->
            <div style="width: 120px; height: 160px; margin-right: 30px; border: 2px solid #007bff; border-radius: 8px; overflow: hidden; background-color: #f0f0f0; flex-shrink: 0;">
              <!-- 照片占位符 -->
              <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #999;">
                <div style="font-size: 40px; margin-bottom: 5px;">📷</div>
                <div>照片占位</div>
              </div>
            </div>
            
            <!-- 右侧个人信息区域 -->
            <div style="flex: 1;">
              <h1 style="margin: 0 0 10px 0; color: #007bff; font-size: 2.5em;">李国琪</h1>
              <div class="contact-info" style="font-size: 1.1em; color: #666; margin-bottom: 10px;">
                <span>📞 18533514715</span>
                <span>📧 Anna799807@outlook.com</span>
                <span>📍 深圳</span>
                <span>💼 AI产品经理/AI提效专家/AI训练师</span>
              </div>
              <div style="color: #666; font-size: 1.1em;">
                <span>ENTP</span> | 
                <span>3年跨境运营主管</span> | 
                <span>AI原生开发者</span> | 
                <span>Prompt工程师</span> | 
                <span>业务+技术双视角</span>
              </div>
            </div>
          </header>
          
          <section>
            <h2>🌟 核心优势</h2>
            <div class="section-content">
              <ul>
                <li><strong>产品落地：</strong>可独立完成AI MVP从0到1全流程交付，熟练运用Trae、Coze等AI工具，高效推进产品从需求到落地的闭环。</li>
                <li><strong>商业洞察：</strong>深耕跨境电商领域，熟悉全链路业务痛点，能精准挖掘AI技术与业务场景的结合点，实现技术赋能业务增长。</li>
                <li><strong>技术能力：</strong>掌握LLM（大语言模型）核心特性，擅长RAG、CoT调优及自然语言编程，具备扎实的技术理解力与落地能力。</li>
                <li><strong>数据驱动：</strong>拥有Google Analytics埋点部署、GitHub API配置实战经验，坚持以数据为导向，优化产品体验与业务效率。</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h2>💼 工作经历</h2>
            <div class="section-content">
              <div class="item">
                <div class="item-header">
                  <div class="item-title">运营主管</div>
                  <div class="item-date">2024.06 - 2026.01</div>
                </div>
                <div class="item-company">深圳市智启达贸易有限公司</div>
                <ul>
                  <li>梳理公司跨境业务全流程，精准识别可AI替代的低效环节，输出标准化SOP文档，为后续AI提效工具落地奠定基础</li>
                  <li>主导3款核心产品从0到1起量运营，制定精准推广与定价策略，实现单款产品月销售额突破100万</li>
                  <li>引入AI工具优化运营全流程，重点提升客服响应效率与文案制作效率，实现双环节提效40%-50%</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h2>🎓 教育背景</h2>
            <div class="section-content">
              <div class="item">
                <div class="item-header">
                  <div class="item-title">旅游管理专业</div>
                  <div class="item-date">2018.09 - 2022.06</div>
                </div>
                <div class="item-company">河北科技师范学院</div>
                <p>本科，主修市场营销、数据分析等核心课程，具备扎实的商业逻辑与用户思维，为AI产品落地、跨境运营等相关工作提供坚实理论支撑。</p>
              </div>
            </div>
          </section>
          
          <section>
            <h2>🛠️ 技能清单</h2>
            <div class="section-content">
              <div class="skills">
                <span class="skill-tag">Trae</span>
                <span class="skill-tag">Coze</span>
                <span class="skill-tag">LLM</span>
                <span class="skill-tag">RAG</span>
                <span class="skill-tag">CoT</span>
                <span class="skill-tag">Prompt工程</span>
                <span class="skill-tag">自然语言编程</span>
                <span class="skill-tag">Google Analytics</span>
                <span class="skill-tag">GitHub API</span>
                <span class="skill-tag">PRD撰写</span>
                <span class="skill-tag">需求拆解</span>
                <span class="skill-tag">跨境电商运营</span>
              </div>
            </div>
          </section>
          
          <section>
            <h2>🚀 项目经历</h2>
            <div class="section-content">
              <div class="item">
                <div class="item-header">
                  <div class="item-title">AI育儿全生命周期助手（独立开发）</div>
                  <div class="item-date">2025.12 - 2026.03</div>
                </div>
                <ul>
                  <li>聚焦备孕、青春期干预两大核心育儿场景，深入挖掘用户核心需求</li>
                  <li>设计贴合实际使用场景的AI解决方案，全面适配育儿全阶段需求</li>
                  <li>提升用户使用体验，实现AI技术与育儿场景的深度融合</li>
                </ul>
              </div>
              
              <div class="item">
                <div class="item-header">
                  <div class="item-title">跨境电商自动化创业项目</div>
                  <div class="item-date">2025.09 - 2026.01</div>
                </div>
                <ul>
                  <li>独立负责跨境电商全流程运营（选品、供应链、推广等）</li>
                  <li>搭建AI自动化脚本优化核心业务流程，有效提升单店运营效率60%</li>
                  <li>降低人力成本80%，实现业务稳定盈利</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h2>💡 个人总结</h2>
            <div class="section-content">
              <p>拥有3年跨境运营主管实战经验，兼具扎实的业务认知与AI技术落地能力，擅长从业务痛点出发，运用AI工具打造高价值产品，可独立完成AI产品从0到1的落地与迭代，快速适配目标岗位，为团队创造核心价值。</p>
            </div>
          </section>
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
    <>
      {/* 切换编辑模式按钮 */}
      <motion.button 
        className={`btn-${isEditMode ? 'primary' : 'secondary'} fixed top-6 right-60 z-40`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleEditMode}
      >
        {isEditMode ? '🔒 退出编辑' : '✏️ 进入编辑'}
      </motion.button>
      
      {/* 生成PDF按钮 */}
      <motion.button 
        className="btn-secondary fixed top-6 right-6 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generatePDF}
      >
        📄 生成简历PDF
      </motion.button>
    </>
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
const EditableSkill = ({ skill, percentage, onChange, isEditMode, onDelete }: { skill: string; percentage: number; onChange: (skill: string, percentage: number) => void; isEditMode: boolean; onDelete?: (skill: string) => void }) => {
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

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(skill);
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
              {isEditMode && onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="text-xs text-red-500 hover:underline"
                >
                  删除
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

// 可编辑证书组件 - 荣誉墙风格
const EditableCertificate = ({ certificate, index, onChange, isEditMode }: { certificate: { image: string; title: string; description: string }; index: number; onChange: (index: number, certificate: { image: string; title: string; description: string }) => void; isEditMode: boolean }) => {
  const [editCertificate, setEditCertificate] = useState(certificate);
  const [previewImage, setPreviewImage] = useState<string>(certificate.image);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target?.result as string;
        setPreviewImage(base64Image);
        setEditCertificate({ ...editCertificate, image: base64Image });
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理URL输入变化
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewImage(url);
    setEditCertificate({ ...editCertificate, image: url });
  };

  const handleSave = () => {
    onChange(index, editCertificate);
  };

  if (!isEditMode) {
    return (
      <motion.div 
        className="certificate-item rounded-lg overflow-hidden border border-primary/20 bg-surface/50"
        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0, 255, 255, 0.3)" }}
      >
        <img 
          src={certificate.image} 
          alt={certificate.title || '证书'} 
          className="w-full h-48 object-cover"
        />
        {certificate.title && (
          <div className="p-2">
            <h4 className="text-sm font-bold text-center text-primary">{certificate.title}</h4>
            {certificate.description && (
              <p className="text-xs text-center text-muted truncate">{certificate.description}</p>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="certificate-item rounded-lg overflow-hidden border-2 border-primary/50 p-2 bg-surface/80">
      {/* 图片预览 */}
      {previewImage && (
        <div className="mb-3">
          <img 
            src={previewImage} 
            alt="预览" 
            className="w-full h-32 object-cover rounded border border-primary/30"
          />
        </div>
      )}
      
      {/* 文件上传选项 */}
      <div className="mb-3">
        <label className="block text-xs text-muted mb-1">选择本地图片：</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 bg-background border border-primary/30 rounded"
        />
      </div>
      
      {/* 图片URL输入（可选） */}
      <div className="mb-3">
        <label className="block text-xs text-muted mb-1">或输入图片URL：</label>
        <input
          type="text"
          value={editCertificate.image}
          onChange={handleUrlChange}
          placeholder="证书图片URL（可选）"
          className="w-full p-2 bg-background border border-primary/30 rounded"
        />
      </div>
      
      {/* 证书信息 */}
      <input
        type="text"
        value={editCertificate.title}
        onChange={(e) => setEditCertificate({ ...editCertificate, title: e.target.value })}
        placeholder="证书名称（可选）"
        className="w-full mb-2 p-2 bg-background border border-primary/30 rounded"
      />
      <input
        type="text"
        value={editCertificate.description}
        onChange={(e) => setEditCertificate({ ...editCertificate, description: e.target.value })}
        placeholder="简短描述（可选）"
        className="w-full mb-2 p-2 bg-background border border-primary/30 rounded"
      />
      <button
        onClick={handleSave}
        className="w-full py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
      >
        保存
      </button>
    </div>
  );
};

// 可编辑项目组件
const EditableProjectCard = ({ project, index, onChange, isEditMode }: { project: { title: string; description: string; tech: string[]; image: string; solution?: string; result?: string; link?: string }; index: number; onChange: (index: number, project: { title: string; description: string; tech: string[]; image: string; solution?: string; result?: string; link?: string }) => void; isEditMode: boolean }) => {
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
      <div className="aspect-video bg-surface rounded-xl overflow-hidden mb-4 relative">
        {isEditMode ? (
          <div className="relative w-full h-full">
            <img
              src={isEditing ? editProject.image : project.image}
              alt={isEditing ? editProject.title : project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <label className="cursor-pointer text-white flex items-center space-x-2 bg-primary/80 px-4 py-2 rounded-lg hover:bg-primary transition-colors">
                <span>📁</span>
                <span>上传图片</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64Image = event.target?.result as string;
                        if (isEditing) {
                          setEditProject(prev => ({ ...prev, image: base64Image }));
                        } else {
                          onChange(index, { ...project, image: base64Image });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        ) : (
          <img
            src={isEditing ? editProject.image : project.image}
            alt={isEditing ? editProject.title : project.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editProject.title}
            onChange={(e) => setEditProject(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-surface border border-primary/50 rounded px-2 py-1 mb-2 text-xl font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="mb-2">
            <label className="block text-sm font-medium text-primary mb-1">精选项目描述：</label>
            <textarea
              value={editProject.briefDescription || ''}
              onChange={(e) => setEditProject(prev => ({ ...prev, briefDescription: e.target.value }))}
              className="w-full bg-surface border border-primary/50 rounded px-2 py-1 text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              placeholder="精选项目的简短描述..."
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-primary mb-1">项目案例痛点：</label>
            <textarea
              value={editProject.description}
              onChange={(e) => setEditProject(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-surface border border-primary/50 rounded px-2 py-1 text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              placeholder="项目案例的痛点描述..."
            />
          </div>
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
          <textarea
            value={editProject.solution || ''}
            onChange={(e) => setEditProject(prev => ({ ...prev, solution: e.target.value }))}
            placeholder="解决方案..."
            className="w-full bg-surface border border-primary/50 rounded px-2 py-1 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
          <textarea
            value={editProject.result || ''}
            onChange={(e) => setEditProject(prev => ({ ...prev, result: e.target.value }))}
            placeholder="成果..."
            className="w-full bg-surface border border-primary/50 rounded px-2 py-1 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
          <input
            type="text"
            value={editProject.link || ''}
            onChange={(e) => setEditProject(prev => ({ ...prev, link: e.target.value }))}
            placeholder="项目链接..."
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
          <p className="text-muted mb-4">{editProject.briefDescription || editProject.description}</p>
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
// 所有接口定义已移至src/app/data.ts文件

// 默认数据已移至src/app/data.ts文件
// 此定义已被导入替代

// 从localStorage加载数据
const loadData = (): WebsiteData => {
  try {
    // 仅在客户端使用localStorage
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('websiteData');
      if (savedData) {
        // 将解析后的数据与defaultData合并，确保所有必需的字段都存在
        const parsedData = JSON.parse(savedData);
        
        // 特别确保projects字段存在且与defaultData的结构一致
        // 合并projects数组，确保每个项目都包含所有必需的字段
        const mergedProjects = defaultData.projects.map((defaultProject, index) => {
          // 如果localStorage中有对应的项目，则合并
          const parsedProject = parsedData.projects?.[index];
          if (parsedProject) {
            return {
              ...defaultProject,
              ...parsedProject
            };
          }
          // 否则使用默认项目
          return defaultProject;
        });
        
        return {
          ...defaultData,
          ...parsedData,
          // 使用合并后的projects数组
          projects: mergedProjects,
          // 特别确保certificates字段存在
          certificates: parsedData.certificates || defaultData.certificates
        };
      }
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

  // 编辑模式状态管理
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 编辑模式密码（可以修改为您想要的密码）
  const EDIT_PASSWORD = '123456';

  // 切换编辑模式
  const toggleEditMode = () => {
    if (isEditMode) {
      // 如果已经在编辑模式，直接退出
      setIsEditMode(false);
    } else {
      // 如果不在编辑模式，显示密码输入框
      setShowPasswordModal(true);
      setPassword('');
      setPasswordError('');
    }
  };

  // 验证密码并进入编辑模式
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === EDIT_PASSWORD) {
      setIsEditMode(true);
      setShowPasswordModal(false);
      setPasswordError('');
    } else {
      setPasswordError('密码错误，请重新输入');
    }
  };

  // 关闭密码输入框
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
  };

  // 初始化数据为defaultData
  const [data, setData] = useState<WebsiteData>(defaultData);

  // 在客户端加载数据，避免hydration错误
  useEffect(() => {
    const loadedData = loadData();
    if (loadedData) {
      setData(loadedData);
    }
  }, []);

  // 客户端渲染状态
  const [isClient, setIsClient] = useState(false);

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // 添加新技能
  const addNewSkill = () => {
    const newSkill = { name: '新技能', percentage: 50 };
    const updatedSkills = [...skills, newSkill];
    const updatedData = { ...data, skills: updatedSkills };
    setData(updatedData);
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
  };

  // 删除技能
  const deleteSkill = (skillName: string) => {
    if (skills.length <= 1) return; // 至少保留一个技能
    const updatedSkills = skills.filter(skill => skill.name !== skillName);
    const updatedData = { ...data, skills: updatedSkills };
    setData(updatedData);
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
  };

  // 处理项目更新
  const handleProjectChange = (index: number, updatedProject: { title: string; description: string; tech: string[]; image: string; solution?: string; result?: string; link?: string }) => {
    const updatedProjects = projects.map((project, i) => 
      i === index ? updatedProject : project
    );
    const updatedData = { ...data, projects: updatedProjects };
    setData(updatedData);
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
  };

  // 保存状态
  const [isSaving, setIsSaving] = useState(false);

  // 保存所有项目修改
  const saveAllProjects = () => {
    setIsSaving(true);
    
    // 触发保存效果，确保所有数据都已保存
    const updatedData = {
      ...data,
      projects: [...projects] // 确保引用更新
    };
    
    // 重新保存所有数据到localStorage
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
    
    // 视觉反馈
    setTimeout(() => {
      setIsSaving(false);
      alert('所有项目修改已成功保存！\n\n数据已保存到浏览器的localStorage中，\n您可以通过"💾 导出数据"按钮将数据永久保存到文件中。');
    }, 800);
  };

  // 处理证书更新
  const handleCertificateChange = (index: number, updatedCertificate: { image: string; title: string; description: string }) => {
    const updatedCertificates = data.certificates.map((certificate, i) => 
      i === index ? updatedCertificate : certificate
    );
    const updatedData = { ...data, certificates: updatedCertificates };
    setData(updatedData);
    localStorage.setItem('websiteData', JSON.stringify(updatedData));
  };

  return (
    <div className="min-h-screen">
      <CursorFollower />
      
      {/* 密码输入模态框 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div 
            className="bg-surface p-8 rounded-2xl shadow-2xl border border-primary/50 w-full max-w-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">进入编辑模式</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-muted mb-2">密码</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="请输入编辑模式密码"
                  autoFocus
                />
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm mb-4">{passwordError}</div>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                >
                  确认
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* 数据导出按钮 */}
      {isEditMode && (
        <motion.button 
          className="btn-secondary fixed top-6 right-112 z-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const currentData = JSON.stringify(data, null, 2);
            const blob = new Blob([currentData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'websiteData.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('数据已导出，请将导出的JSON内容更新到defaultData中！');
          }}
        >
          💾 导出数据
        </motion.button>
      )}
      
      <PDFGenerator data={data} toggleEditMode={toggleEditMode} isEditMode={isEditMode} />
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
              <span className="glow-text">{data.heroTitle}</span>
            </h1>
            <p className="text-2xl md:text-3xl text-muted mb-8 max-w-3xl mx-auto">
              <TypewriterEffect text={data.heroSubtitle} />
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
              {/* 只在客户端渲染照片，避免hydration错误 */}
              {isClient && (
                <img src={data.profilePhoto} alt="个人照片" className="w-full h-full object-cover" />
              )}
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
            {isEditMode && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-muted mb-1">GitHub链接：</label>
                <input
                  type="text"
                  value={data.githubLink || ''}
                  onChange={(e) => {
                    const updatedData = { ...data, githubLink: e.target.value };
                    setData(updatedData);
                    localStorage.setItem('websiteData', JSON.stringify(updatedData));
                  }}
                  className="w-full bg-surface border border-primary/50 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="输入GitHub链接..."
                />
              </div>
            )}
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
                  onDelete={(skillName) => deleteSkill(skillName)}
                  isEditMode={isEditMode}
                />
              ))}
              {isEditMode && (
                <button
                  onClick={addNewSkill}
                  className="w-full py-2 text-sm text-center text-primary hover:bg-primary/10 rounded"
                >
                  ➕ 添加新技能
                </button>
              )}
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
          
          {/* 荣誉墙展示 */}
          <motion.div 
            className="bento-card lg:col-span-3"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <h3 className="text-xl font-bold mb-6 text-secondary">荣誉墙</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.certificates.map((certificate, index) => (
                <EditableCertificate 
                  key={index}
                  certificate={certificate} 
                  index={index} 
                  onChange={handleCertificateChange} 
                  isEditMode={isEditMode} 
                />
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

          {/* 保存按钮 */}
          {isEditMode && (
            <motion.button 
              className="btn-primary mb-6"
              whileHover={!isSaving ? { scale: 1.05 } : {}}
              whileTap={!isSaving ? { scale: 0.95 } : {}}
              onClick={saveAllProjects}
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </span>
              ) : (
                '💾 保存所有项目修改'
              )}
            </motion.button>
          )}

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
                <div className="aspect-video bg-surface rounded-xl overflow-hidden mb-4 relative">
                  {isEditMode ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer text-white flex items-center space-x-2 bg-primary/80 px-4 py-2 rounded-lg hover:bg-primary transition-colors">
                          <span>📁</span>
                          <span>上传图片</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const base64Image = event.target?.result as string;
                                  handleProjectChange(index, { ...project, image: base64Image });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <EditableText value={project.title} onChange={(value) => handleProjectChange(index, { ...project, title: value })} className="text-xl font-bold mb-2 text-primary" isEditMode={isEditMode} />
                {/* 可编辑的项目详情 */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-secondary">痛点</h4>
                    {isEditMode ? (
                      <textarea
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, { ...project, description: e.target.value })}
                        className="w-full p-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                        rows={3}
                        placeholder="描述项目的痛点..."
                      />
                    ) : (
                      <p className="text-muted">{project.description}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-secondary">解决方案</h4>
                    {isEditMode ? (
                      <textarea
                        value={project.solution || ''}
                        onChange={(e) => handleProjectChange(index, { ...project, solution: e.target.value })}
                        className="w-full p-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                        rows={3}
                        placeholder="描述解决方案..."
                      />
                    ) : (
                      <p className="text-muted">{project.solution || '暂无解决方案描述'}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-secondary">成果</h4>
                    {isEditMode ? (
                      <textarea
                        value={project.result || ''}
                        onChange={(e) => handleProjectChange(index, { ...project, result: e.target.value })}
                        className="w-full p-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                        rows={3}
                        placeholder="描述项目成果..."
                      />
                    ) : (
                      <p className="text-muted">{project.result || '暂无成果描述'}</p>
                    )}
                  </div>
                  
                  {/* 可编辑的项目链接 */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-secondary">项目链接</h4>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={project.link || ''}
                        onChange={(e) => handleProjectChange(index, { ...project, link: e.target.value })}
                        className="w-full p-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="输入项目链接或网址..."
                      />
                    ) : (
                      project.link && (
                        <p className="text-muted break-all">
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {project.link}
                          </a>
                        </p>
                      )
                    )}
                  </div>
                </div>
                
                {/* 查看完整案例按钮/链接 */}
                {project.link ? (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary mt-6 inline-block"
                  >
                    查看完整案例
                  </a>
                ) : (
                  <button className="btn-primary mt-6">查看完整案例</button>
                )}
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
          {data.githubLink ? (
            <motion.a 
              href={data.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-8 py-3 inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              查看GitHub
            </motion.a>
          ) : (
            <motion.button 
              className="btn-secondary px-8 py-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled
              title="请先设置GitHub链接"
            >
              查看GitHub
            </motion.button>
          )}
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-10 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-muted">
          <p>© {new Date().getFullYear()} {data.footerTitle || 'AI开发者'}. 保留所有权利.</p>
          <p className="mt-2 text-sm">使用Next.js、Tailwind CSS和Framer Motion构建</p>
        </div>
      </footer>
    </div>
  );
}
