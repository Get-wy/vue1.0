/*
 * @Author: WangYu
 * @Date: 2020-02-26 18:30:45
 * @LastEditors: WangYu
 * @LastEditTime: 2020-02-26 19:06:47
 */
// 遍历dom结构 解析 指令和插值表达式
class Compile{
  // el是 等待编译的模板 vm是Wvue实例
  constructor(el, vm) {
    this.$vm = vm
    this.$el = document.querySelector(el)

    // 把模板中的内容移到片段中 操作
    this.$fragment = this.node2Fragment(this.$el)

    // 执行编译
    this.compile(this.$fragment)

    // 放回$el中
    this.$el.appendChild(this.$fragment)

  }

  node2Fragment(el){
    //创建片段
    const fragment = document.createDocumentFragment();
    let child;
    while(child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment;
  }

  compile(el) {
    const childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if(node.nodeType == 1) {
        console.log("编译元素" + node.nodeName)
      } else if(this.isInter(node)) {
        // 只关心{{xxx}}
        console.log('编译插值文本'+ node.textContent)
      } else {

      }
    })
  }
  isInter(node) {
    return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}