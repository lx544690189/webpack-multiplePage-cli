import './part1.css'
import './part2.css'
import utiles from '../../lib/utiles'
let test = {
    fn: () => 'page1'
}
console.log(test.fn())
utiles()
//启用模块热更新，副作用：事件绑定、手动插入并且没有销毁的dom、定时器等，这些都需要手动处理。故不要太依赖模块热更新
if (module.hot) {
    module.hot.accept()
}