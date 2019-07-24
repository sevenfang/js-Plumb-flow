
# JSPlumbFlows
该工作流插件具备拖拽工作流节点、各个工作流节点生成连线，最终可以生成提交相关的JSON数据提交给后台。运用了前端UI框架React结合jsplumb连线绘图工具库及React DnD拖拽组件完成开发。主要的设计思路是组件化开发，利用React DnD拖拽左侧的工作的节点从而监听绘图区域的数据状态变化，再利用jsplumb生成相对应的操作对象，进行连线、编辑属性等操作，后期在开发的过程中增加新的工作流节点时，只需要增加相对应的组件的就可以了。
=======

# react-jsplumb-flow

在React中使用jsPlumb.js绘制流程图.

# 项目展示：
![image](https://github.com/zhg1187049778/js-Plumb-flow/blob/master/jsPlumbFlows.gif)

# 如何运行此项目

1.拉取代码后，本地执行yarn install，耐心等待依赖安装完毕。<br>
2.执行 yarn start, 项目运行localhost:3000，开始你的表演。



