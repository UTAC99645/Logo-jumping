// 注入动画样式，避免重复注入
function injectCustomStyles() {
  if (document.getElementById('all-logo-bounce-style')) return;

  const style = document.createElement('style');
  style.id = 'all-logo-bounce-style';
  style.textContent = `
    /* 核心弹跳动画：向下压缩突出→向上弹起→无缝循环 */
    @keyframes logoSquashBounce {
      0% {
        transform: scaleY(1) scaleX(1);
      }
      45% {
        /* 压缩阶段：高度压扁，宽度向外突出 */
        transform: scaleY(0.6) scaleX(1.3);
        transform-origin: center bottom;
      }
      65% {
        /* 弹起阶段：高度拉伸，宽度收缩，模拟真实弹跳 */
        transform: scaleY(1.2) scaleX(0.85);
        transform-origin: center bottom;
      }
      100% {
        transform: scaleY(1) scaleX(1);
        transform-origin: center bottom;
      }
    }

    /* 给匹配到的元素应用动画，默认全程循环播放 */
    .auto-bounce-element {
      animation: logoSquashBounce 0.5s ease-in-out infinite !important;
      display: inline-block !important;
    }

    /* 【可选】hover触碰时才触发动画
    启用方法：删掉上面.auto-bounce-element里的animation，取消下面的注释
    .auto-bounce-element:hover {
      animation: logoSquashBounce 0.6s ease-in-out infinite !important;
    }
    */
  `;
  document.head.appendChild(style);
}

// 匹配所有Logo/图标，应用动画
function applyBounceAnimation() {
  // 全场景匹配规则，覆盖99%网站的Logo、品牌图标和加载元素
const targetSelectors = [
  // 核心Logo匹配（id/class含logo/brand关键词，不区分大小写）
  '[id*="logo" i]',
  '[class*="logo" i]',
  '[id*="brand" i]',
  '[class*="brand" i]',
  '[class*="商标" i]',
  '[class*="品牌" i]',
  '[class*="site-icon" i]',
  '[class*="header-icon" i]',
  '[class*="品牌标识" i]',
  '[class*="网站标志" i]',
  // 图片Logo匹配（alt/title含logo/品牌关键词）
  'img[alt*="logo" i]',
  'img[title*="logo" i]',
  'img[alt*="品牌" i]',
  'img[title*="商标" i]',
  'img[alt*="标志" i]',
  'img[title*="图标" i]',
  // 头部导航Logo（绝大多数网站Logo都在header/nav区域）
  'header img',
  'header svg',
  'nav img',
  'nav svg',
  '.header img',
  '.nav img',
  // 页脚Logo
  'footer img',
  'footer svg',
  // 全量加载图标匹配（保留之前的Cloudflare加载图标适配）
  '[id*="spinner" i]',
  '[class*="spinner" i]',
  '[id*="loader" i]',
  '[class*="loader" i]',
  '[role="progressbar"]'
];


  // 遍历所有匹配到的元素
  targetSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      // 跳过已处理的元素，避免重复操作
      if (el.dataset.bounceApplied) return;

      // 过滤：跳过尺寸过小的图标（宽高<24px），避免影响页面体验
      const rect = el.getBoundingClientRect();
      if (rect.width < 24 && rect.height < 24) return;

      // 添加动画类，标记已处理
      el.classList.add('auto-bounce-element');
      el.dataset.bounceApplied = 'true';
      void el.offsetWidth; // 强制浏览器重绘，确保动画生效
    });
  });
}

// 插件初始化
function initPlugin() {
  injectCustomStyles();
  applyBounceAnimation();

  // 监听DOM动态变化，处理异步加载的Logo/元素
  const domObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) applyBounceAnimation();
    });
  });

  domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

// 兼容页面所有加载状态，确保脚本正常执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPlugin);
} else {
  initPlugin();
}
