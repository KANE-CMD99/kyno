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
    "admin.creators_profile_hint": "Profile: kyno.dev/{username}",

    // Creator Dashboard
    "creator.title": "Creator Dashboard",
    "creator.products": "My Products",
    "creator.earnings": "Earnings",
    "creator.sales": "Sales",
    "creator.signout": "Sign Out",
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
    if (stored === "en" || stored === "zh") setLangState(stored);
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
