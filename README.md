# js-Plumb-flow
该工作流插件具备拖拽工作流节点、各个工作流节点生成连线，最终可以生成提交相关的JSON数据提交给后台。运用了前端UI框架React结合jsplumb连线绘图工具库及React DnD拖拽组件完成开发。主要的设计思路是组件化开发，利用React DnD拖拽左侧的工作的节点从而监听绘图区域的数据状态变化，再利用jsplumb生成相对应的操作对象，进行连线、编辑属性等操作，后期在开发的过程中增加新的工作流节点时，只需要增加相对应的组件的就可以了。
