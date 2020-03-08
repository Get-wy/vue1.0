/*
 * @Author: WangYu
 * @Date: 2020-02-24 17:05:00
 * @LastEditors: WangYu
 * @LastEditTime: 2020-03-08 21:14:45
 * 
 */
class WVue{
  constructor(options) {
    // 保存选项
    this.$options = options

    //传入data
    this.$data = options.data

    // // 响应化处理
    this.observe(this.$data)

    // new Watcher(this, 'foo')
    // this.foo // 读一次 触发依赖收集
    // new Watcher(this, 'coo.a')
    // this.coo.a

    new Compile(options.el, this);

    if(options.created) {
      options.created.call(this)
    }
  }

  observe(value) {
    if(!value || typeof value !== 'object'){
      return;
    }
    // 遍历value
    Object.keys(value).forEach(key => {
      //响应式处理
      this.defineReactive(value, key, value[key]);
      // 代理data中的属性到vue根上
      this.proxyData(key)
    })
  }
  defineReactive(obj, key, value) {
    //递归遍历
    this.observe(value);

    // 定义了一个dep
    const dep = new Dep() // 每个dep实例和data中的key有对应关系


    // 给obj的每一个key定义拦截
    Object.defineProperty(obj, key, {
      get() {
        // 依赖收集
        Dep.target && dep.addDep(Dep.target)
        return value;
      },
      set(newVal) {
        if(newVal !== value) {
          value = newVal
          console.log(key + '属性更新了')
          dep.notify();
        }
      }
    })
  }

  proxyData(key) {
    // this指 WVUE的实例
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key]
      },
      set(newVal) {
        this.$data[key] = newVal
      }
    }) 
  }
}

// 创建dep类： 用来管理所有的 watcher
class Dep {
  constructor() {
    // 存储所有的依赖
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}

//创建watcher：保存和页面中的挂钩关系  data中的数值 和 页面关系

class Watcher {
  constructor(vm, key, cb) {
    // 创建实例立刻将该实例指向 Dep.target 便于依赖收集
    this.vm = vm
    this.key = key
    this.cb = cb

    // 出发依赖收集
    Dep.target = this;
    this.vm[this.key] 
    Dep.target = null
  }

  //更新
  update() {
    console.log(this.key + '更新了！')
    this.cb.call(this.vm, this.vm[this.key] )
  }
}
