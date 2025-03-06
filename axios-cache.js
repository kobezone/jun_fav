import axios from 'axios';
import md5 from 'md5';

class AxiosCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.cacheTime = options.cacheTime || 2000; // 默认缓存2秒
    this.axios = options.axios || axios;
    this.excludeUrls = options.excludeUrls || [];
    this.init();
  }

  /**
   * 生成请求的唯一键
   * @param {Object} config - axios请求配置
   * @returns {String} 请求的唯一标识
   */
  generateKey(config) {
    const { url, method, params, data } = config;
    // 使用 url + method + 序列化的params和data 生成唯一键
    return md5(`${url}|${method}|${JSON.stringify(params || {})}|${JSON.stringify(data || {})}`);
  }

  /**
   * 判断请求是否应该被缓存
   * @param {Object} config - axios请求配置
   * @returns {Boolean} 是否应该缓存
   */
  shouldCache(config) {
    // 只缓存GET请求，或者可以根据需求自定义
    if (config.method.toLowerCase() !== 'get') {
      return false;
    }

    // 检查是否在排除列表中
    if (this.excludeUrls.some(pattern => {
      if (typeof pattern === 'string') {
        return config.url.includes(pattern);
      } else if (pattern instanceof RegExp) {
        return pattern.test(config.url);
      }
      return false;
    })) {
      return false;
    }

    // 检查请求配置中是否明确指定不缓存
    return config.cache !== false;
  }

  /**
   * 初始化拦截器
   */
  init() {
    // 请求拦截器
    this.axios.interceptors.request.use(config => {
      if (!this.shouldCache(config)) {
        return config;
      }

      const key = this.generateKey(config);
      const cachedResponse = this.cache.get(key);

      if (cachedResponse && Date.now() - cachedResponse.timestamp < this.cacheTime) {
        // 如果有缓存且未过期，取消请求并返回缓存
        const source = axios.CancelToken.source();
        config.cancelToken = source.token;
        source.cancel(JSON.stringify(cachedResponse.data));
      }

      return config;
    });

    // 响应拦截器
    this.axios.interceptors.response.use(
      response => {
        // 对于成功的响应进行缓存
        if (this.shouldCache(response.config)) {
          const key = this.generateKey(response.config);
          this.cache.set(key, {
            data: response.data,
            timestamp: Date.now()
          });
        }
        return response;
      },
      error => {
        // 处理被取消的请求（命中缓存的情况）
        if (axios.isCancel(error)) {
          try {
            return Promise.resolve({
              data: JSON.parse(error.message),
              status: 200,
              statusText: 'OK',
              headers: {},
              config: error.config,
              cached: true
            });
          } catch (e) {
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 清除所有缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 清除特定URL的缓存
   * @param {String} url - 要清除缓存的URL
   */
  clearCacheByUrl(url) {
    for (const [key, value] of this.cache.entries()) {
      if (key.includes(url)) {
        this.cache.delete(key);
      }
    }
  }
}

// 创建默认实例
const axiosCache = new AxiosCache();

// 导出工厂函数，允许创建自定义实例
export const createAxiosCache = (options) => new AxiosCache(options);

// 导出默认实例
export default axiosCache;