"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Lang = "en" | "zh";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.contact": "Contact",
    "nav.signin": "Sign In",
    "nav.cart": "Cart",
    "nav.cart.items": "{n} items",
    "nav.cart.empty": "Your cart is empty",
    "nav.cart.empty_hint": "Add some products to get started.",
    "nav.cart.continue": "Continue Shopping",
    "nav.cart.checkout": "Checkout",
    "nav.cart.subtotal": "Subtotal",
    "nav.cart.clear": "Clear cart",

    // Admin
    "admin.title": "Admin Panel",
    "admin.products": "Products",
    "admin.creators": "Creators",
    "admin.affiliates": "Affiliates",
    "admin.signout": "Sign Out",
    "admin.view_site": "View Site",
    "admin.new_product": "+ New Product",
    "admin.edit": "Edit",
    "admin.delete": "Delete",
    "admin.actions": "Actions",
    "admin.category": "Category",
    "admin.price": "Price",
    "admin.basic_info": "Basic Info",
    "admin.product_name": "Product Name",
    "admin.creator": "Creator",
    "admin.description": "Description",
    "admin.preview_images": "Preview Images",
    "admin.preview_images_hint": "Shown on storefront as product thumbnails",
    "admin.upload_images": "Upload preview images",
    "admin.images_hint": "PNG, JPG, WebP · Max 5MB each",
    "admin.digital_file": "Digital Product File",
    "admin.digital_file_hint": "The actual downloadable file customers receive after purchase",
    "admin.upload_file": "Upload product file",
    "admin.file_hint": "ZIP, OTF, TTF, WOFF2, PDF · Max 200MB",
    "admin.features": "Features",
    "admin.includes": "What's Included",
    "admin.save": "Save Changes",
    "admin.create": "Create Product",
    "admin.cancel": "Cancel",
    "admin.back": "Back to products",
    "admin.saving": "Saving...",
    "admin.uploading": "Uploading...",
    "admin.total": "{n} total",
    "admin.no_products": "No products yet. Create your first one.",
    "admin.delete_confirm": "Delete \"{name}\"? This cannot be undone.",
    "admin.search": "Search products...",
    "admin.sort_default": "Sort: Default",
    "admin.sort_price_asc": "Price: Low to High",
    "admin.sort_price_desc": "Price: High to Low",
    "admin.sort_name_asc": "Name: A to Z",
    "admin.sort_name_desc": "Name: Z to A",

    // Admin Creators
    "admin.creators_title": "Creators",
    "admin.creators_count": "{n} invited",
    "admin.creators_invite": "+ Invite Creator",
    "admin.creators_name": "Full Name",
    "admin.creators_username": "Username",
    "admin.creators_email": "Email",
    "admin.creators_password": "Password",
    "admin.creators_bio": "Bio",
    "admin.creators_commission": "Kyno Commission %",
    "admin.creators_create": "Create Account",
    "admin.creators_profile": "Profile",
    "admin.creators_sales": "Sales",
    "admin.creators_earnings": "Earnings",
    "admin.creators_commission_col": "Commission",
    "admin.creators_no_data": "No creators yet. Invite your first designer.",
    "admin.creators_profile_hint": "Profile: kyno.ltd/{username}",

    // Creator Dashboard
    "creator.title": "Creator Dashboard",
    "creator.products": "My Products",
    "creator.earnings": "Earnings",
    "creator.sales": "Sales",
    "creator.signout": "Sign Out",
    "creator.settings": "Settings",
    "creator.view_profile": "View Profile",
    "creator.view_store": "View Store",
    "creator.new_product": "+ New Product",
    "creator.edit": "Edit",
    "creator.delete": "Delete",
    "creator.back": "Back to product list",
    "creator.no_products": "You haven't uploaded any products yet.",
    "creator.no_products_hint": "Click the button above to create your first product.",

    // Creator Login
    "creator.login_title": "Creator Login",
    "creator.login_hint": "Sign in to manage your products",
    "creator.login_email": "Email",
    "creator.login_password": "Password",
    "creator.login_submit": "Sign In",
    "creator.login_error": "Invalid email or password",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.remove": "Remove",
    "common.add": "+ Add",
    "common.success": "Success!",
    "common.copied": "Copied!",
    "common.no_results": "No results found",

    // Checkout
    "checkout.title": "Checkout",
    "checkout.empty_title": "Your cart is empty",
    "checkout.empty_hint": "Add some products before checking out.",
    "checkout.browse": "Browse Products",
    "checkout.loading_cart": "Loading cart...",
    "checkout.items_count": "{n} items in your cart",
    "checkout.order_summary": "Order Summary",
    "checkout.contact_info": "Contact Information",
    "checkout.no_account": "No account needed — just enter your name and email to receive download links.",
    "checkout.full_name": "Full Name",
    "checkout.name_placeholder": "Your name",
    "checkout.email": "Email",
    "checkout.email_placeholder": "you@example.com",
    "checkout.email_hint": "Download links and receipt will be sent to this email.",
    "checkout.pay_button": "Pay with Stripe — {amount}",
    "checkout.redirecting": "Redirecting to checkout...",
    "checkout.stripe_note": "You will be redirected to Stripe to complete your payment securely. Prices shown do not include local sales tax, VAT, or GST where applicable. All sales are final per our",
    "checkout.refund_policy": "Refund Policy",
    "checkout.secure": "Secure checkout",
    "checkout.powered_by": "Powered by Stripe",
    "checkout.network_error": "Network error. Please try again.",

    // Free Downloads
    "free.title": "Free Downloads",
    "free.subtitle": "Free digital products from our creators. Download instantly — no payment required.",
    "free.no_items": "No free downloads available right now. Check back soon.",
    "free.download_btn": "Get Free",

    // Common (extra)
    "common.back": "Back",
    "common.yes": "Yes",
    "common.pending": "Pending",
    "common.refresh": "Refresh",

    // Creator — nav extras
    "creator.analytics": "Analytics",
    "creator.blog": "Blog",
    "creator.back_to_posts": "Back to posts",

    // Creator Settings
    "settings.subtitle": "Manage your account settings.",
    "settings.change_password": "Change Password",
    "settings.password_hint": "Use a strong password that you don't use elsewhere.",
    "settings.current_password": "Current Password",
    "settings.new_password": "New Password",
    "settings.min_chars": "min 6 characters",
    "settings.updating": "Updating...",
    "settings.password_success": "Password changed successfully.",
    "settings.password_failed": "Failed to change password",

    // Creator Analytics
    "analytics.loading": "Loading analytics...",
    "analytics.total_sales": "Total Sales",
    "analytics.orders": "orders",
    "analytics.revenue": "Revenue",
    "analytics.lifetime": "lifetime",
    "analytics.downloads": "Downloads",
    "analytics.files_delivered": "files delivered",
    "analytics.recent_orders": "Recent Orders",
    "analytics.no_orders": "No orders yet.",
    "analytics.product": "Product",
    "analytics.customer": "Customer",
    "analytics.date": "Date",
    "analytics.downloaded": "Downloaded",

    // Creator Blog — list
    "blog.status_draft": "Draft",
    "blog.status_pending": "In review",
    "blog.status_published": "Published",
    "blog.load_failed": "Failed to load posts",
    "blog.delete_confirm": "Delete \"{title}\"? This cannot be undone.",
    "blog.loading": "Loading posts...",
    "blog.posts_title": "Blog posts",
    "blog.posts_count": "{n} post",
    "blog.posts_count_plural": "{n} posts",
    "blog.new_post": "+ New post",
    "blog.no_posts": "You haven't written any posts yet",
    "blog.write_first": "Write your first post",

    // Creator Blog — form
    "blog.edit_title": "Edit: {title}",
    "blog.save_draft": "Save draft",
    "blog.submitting": "Submitting...",
    "blog.submit_review": "Submit for review",
    "blog.live_warning": "This post is live. Saving your changes sends it back for review before it reappears on the site.",
    "blog.field_title": "Title",
    "blog.field_slug": "Slug",
    "blog.slug_placeholder": "auto-from-title",
    "blog.field_excerpt": "Excerpt (shown on cards)",
    "blog.field_cover": "Cover image (optional)",
    "blog.upload_cover": "Upload cover image (PNG/JPG/WebP, max 5MB)",
    "blog.field_content": "Content (Markdown)",
    "blog.err_cover_type": "Only image files allowed for cover",
    "blog.err_cover_size": "Image must be under 5MB",
    "blog.err_upload": "Upload failed",
    "blog.err_title": "Title is required",
    "blog.err_content": "Content is required",
    "blog.err_save": "Save failed",
  },
  zh: {
    // Nav
    "nav.home": "首页",
    "nav.products": "产品",
    "nav.contact": "联系",
    "nav.signin": "登录",
    "nav.cart": "购物车",
    "nav.cart.items": "{n} 件商品",
    "nav.cart.empty": "购物车是空的",
    "nav.cart.empty_hint": "添加一些产品开始吧。",
    "nav.cart.continue": "继续选购",
    "nav.cart.checkout": "去结算",
    "nav.cart.subtotal": "小计",
    "nav.cart.clear": "清空购物车",

    // Admin
    "admin.title": "管理面板",
    "admin.products": "产品管理",
    "admin.creators": "创作者",
    "admin.affiliates": "联盟营销",
    "admin.signout": "退出",
    "admin.view_site": "查看网站",
    "admin.new_product": "+ 新增产品",
    "admin.edit": "编辑",
    "admin.delete": "删除",
    "admin.actions": "操作",
    "admin.category": "分类",
    "admin.price": "价格",
    "admin.basic_info": "基本信息",
    "admin.product_name": "产品名称",
    "admin.creator": "创作者",
    "admin.description": "产品描述",
    "admin.preview_images": "预览图片",
    "admin.preview_images_hint": "在店铺前台展示的产品缩略图",
    "admin.upload_images": "上传预览图片",
    "admin.images_hint": "PNG、JPG、WebP · 每张不超过 5MB",
    "admin.digital_file": "数字产品文件",
    "admin.digital_file_hint": "客户购买后下载的实际文件",
    "admin.upload_file": "上传产品文件",
    "admin.file_hint": "ZIP、OTF、TTF、WOFF2、PDF · 最大 200MB",
    "admin.features": "产品功能",
    "admin.includes": "包含内容",
    "admin.save": "保存更改",
    "admin.create": "创建产品",
    "admin.cancel": "取消",
    "admin.back": "返回产品列表",
    "admin.saving": "保存中...",
    "admin.uploading": "上传中...",
    "admin.total": "共 {n} 个",
    "admin.no_products": "暂无产品，创建第一个吧。",
    "admin.delete_confirm": "确定要删除「{name}」吗？此操作无法撤销。",
    "admin.search": "搜索产品...",
    "admin.sort_default": "排序：默认",
    "admin.sort_price_asc": "价格：从低到高",
    "admin.sort_price_desc": "价格：从高到低",
    "admin.sort_name_asc": "名称：A 到 Z",
    "admin.sort_name_desc": "名称：Z 到 A",

    // Admin Creators
    "admin.creators_title": "创作者管理",
    "admin.creators_count": "已邀请 {n} 位",
    "admin.creators_invite": "+ 邀请创作者",
    "admin.creators_name": "姓名",
    "admin.creators_username": "用户名",
    "admin.creators_email": "邮箱",
    "admin.creators_password": "密码",
    "admin.creators_bio": "简介",
    "admin.creators_commission": "平台佣金 %",
    "admin.creators_create": "创建账号",
    "admin.creators_profile": "主页",
    "admin.creators_sales": "销量",
    "admin.creators_earnings": "收入",
    "admin.creators_commission_col": "佣金",
    "admin.creators_no_data": "暂无创作者。邀请第一位设计师吧。",
    "admin.creators_profile_hint": "主页地址：kyno.dev/{username}",

    // Creator Dashboard
    "creator.title": "创作者中心",
    "creator.products": "我的产品",
    "creator.earnings": "收入",
    "creator.sales": "销量",
    "creator.signout": "退出",
    "creator.settings": "设置",
    "creator.view_profile": "查看主页",
    "creator.view_store": "查看店铺",
    "creator.new_product": "+ 新增产品",
    "creator.edit": "编辑",
    "creator.delete": "删除",
    "creator.back": "返回产品列表",
    "creator.no_products": "你还没有上传任何产品。",
    "creator.no_products_hint": "点击上方按钮创建你的第一个产品。",

    // Creator Login
    "creator.login_title": "创作者登录",
    "creator.login_hint": "登录以管理你的产品",
    "creator.login_email": "邮箱",
    "creator.login_password": "密码",
    "creator.login_submit": "登录",
    "creator.login_error": "邮箱或密码错误",

    // Common
    "common.loading": "加载中...",
    "common.error": "出了点问题",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.close": "关闭",
    "common.remove": "移除",
    "common.add": "+ 添加",
    "common.success": "操作成功！",
    "common.copied": "已复制！",
    "common.no_results": "未找到结果",

    // Checkout
    "checkout.title": "结账",
    "checkout.empty_title": "购物车是空的",
    "checkout.empty_hint": "先添加一些产品再来结账吧。",
    "checkout.browse": "浏览产品",
    "checkout.loading_cart": "加载购物车...",
    "checkout.items_count": "购物车共 {n} 件商品",
    "checkout.order_summary": "订单摘要",
    "checkout.contact_info": "联系信息",
    "checkout.no_account": "无需注册 — 填写姓名和邮箱即可接收下载链接。",
    "checkout.full_name": "姓名",
    "checkout.name_placeholder": "请输入姓名",
    "checkout.email": "邮箱",
    "checkout.email_placeholder": "your@example.com",
    "checkout.email_hint": "下载链接和收据将发送到此邮箱。",
    "checkout.pay_button": "使用 Stripe 支付 — ¥{amount}",
    "checkout.redirecting": "正在跳转支付页面...",
    "checkout.stripe_note": "您将被重定向到 Stripe 安全完成支付。价格不含当地税费。所有销售均遵循我们的",
    "checkout.refund_policy": "退款政策",
    "checkout.secure": "安全支付",
    "checkout.powered_by": "由 Stripe 提供支付服务",
    "checkout.network_error": "网络错误，请重试。",

    // Free Downloads
    "free.title": "免费下载",
    "free.subtitle": "来自创作者的免费数字产品。立即下载 — 无需支付。",
    "free.no_items": "暂无免费下载内容，请稍后再来。",
    "free.download_btn": "免费获取",

    // Common (extra)
    "common.back": "返回",
    "common.yes": "是",
    "common.pending": "待处理",
    "common.refresh": "刷新",

    // Creator — nav extras
    "creator.analytics": "数据分析",
    "creator.blog": "博客",
    "creator.back_to_posts": "返回文章列表",

    // Creator Settings
    "settings.subtitle": "管理你的账号设置。",
    "settings.change_password": "修改密码",
    "settings.password_hint": "请使用未在其他网站使用过的强密码。",
    "settings.current_password": "当前密码",
    "settings.new_password": "新密码",
    "settings.min_chars": "至少 6 个字符",
    "settings.updating": "更新中...",
    "settings.password_success": "密码修改成功。",
    "settings.password_failed": "密码修改失败",

    // Creator Analytics
    "analytics.loading": "正在加载数据...",
    "analytics.total_sales": "总销量",
    "analytics.orders": "笔订单",
    "analytics.revenue": "收入",
    "analytics.lifetime": "累计",
    "analytics.downloads": "下载量",
    "analytics.files_delivered": "已交付文件",
    "analytics.recent_orders": "最近订单",
    "analytics.no_orders": "暂无订单。",
    "analytics.product": "产品",
    "analytics.customer": "客户",
    "analytics.date": "日期",
    "analytics.downloaded": "已下载",

    // Creator Blog — list
    "blog.status_draft": "草稿",
    "blog.status_pending": "审核中",
    "blog.status_published": "已发布",
    "blog.load_failed": "加载文章失败",
    "blog.delete_confirm": "确定删除「{title}」吗？此操作无法撤销。",
    "blog.loading": "正在加载文章...",
    "blog.posts_title": "博客文章",
    "blog.posts_count": "{n} 篇文章",
    "blog.posts_count_plural": "{n} 篇文章",
    "blog.new_post": "+ 新建文章",
    "blog.no_posts": "你还没有写过任何文章",
    "blog.write_first": "写第一篇文章",

    // Creator Blog — form
    "blog.edit_title": "编辑：{title}",
    "blog.save_draft": "保存草稿",
    "blog.submitting": "提交中...",
    "blog.submit_review": "提交审核",
    "blog.live_warning": "此文已上线。保存修改后会重新进入审核，通过后才会再次显示在网站上。",
    "blog.field_title": "标题",
    "blog.field_slug": "链接标识",
    "blog.slug_placeholder": "自动根据标题生成",
    "blog.field_excerpt": "摘要（显示在卡片上）",
    "blog.field_cover": "封面图（可选）",
    "blog.upload_cover": "上传封面图（PNG/JPG/WebP，最大 5MB）",
    "blog.field_content": "正文（Markdown）",
    "blog.err_cover_type": "封面仅支持图片文件",
    "blog.err_cover_size": "图片需小于 5MB",
    "blog.err_upload": "上传失败",
    "blog.err_title": "标题不能为空",
    "blog.err_content": "正文不能为空",
    "blog.err_save": "保存失败",
  },
};

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("kyno-lang") as Lang | null;
    if (stored === "en" || stored === "zh") {
      setLangState(stored);
    }
    // else: default to English (target audience is English-speaking)
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("kyno-lang", l);
  }, []);

  const t = useCallback(
    (key: string, replacements?: Record<string, string | number>) => {
      const dict = translations[lang];
      let text = dict[key] ?? translations.en[key] ?? key;
      if (replacements) {
        for (const [k, v] of Object.entries(replacements)) {
          text = text.replace(`{${k}}`, String(v));
        }
      }
      return text;
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
