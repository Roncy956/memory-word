# 组件结构

## 文件列表

| 组件 | 行数 | 职责 |
|---|---|---|
| `MemoryMain.vue` | 148 | 主页编排器。管理主页/练习页的切换状态（`isMemory`），提供进度条、分组大小滑块、Begin 区域入口、单词列表弹窗。 |
| `MemoryWord.vue` | 223 | 练习编排器。管理背诵状态（当前单词/翻译、进度、不认识词列表），绑定全局键盘快捷键，协调 PracticeCard 和 SettlementScreen 的切换。 |
| `GroupSelector.vue` | 58 | 分组选择侧栏。渲染 100 个 Group 列表，支持点击选择分组和 Location 滚动定位。 |
| `PracticeCard.vue` | 100 | 练习卡片。显示单词/翻译（翻译可切换隐藏），顶部进度条 + Back 按钮 + 语音开关，底部 Don't Know / Show Translation / Next 三按钮。 |
| `SettlementScreen.vue` | 99 | 结算页面。展示本轮是否完成，提供 Exit / Show（不认识词弹窗）/ Next / Restart 操作。 |

## 拆分做了哪些事

### 从 MemoryMain.vue 中提取
- **GroupSelector.vue** — 右侧分组选择面板（Location 按钮 + 100 个 Group 列表）。原来耦合在 MemoryMain 模板中的 `v-for` 列表、`locationGroup` 滚动逻辑、`optionWords` 点击处理全部移入新组件，通过 `@select-group` 事件向父组件上报选中的分组 ID。

### 从 MemoryWord.vue 中提取
- **PracticeCard.vue** — 背诵练习界面（两种卡片：顶部工具栏 + 单词展示卡 + 三按钮导航）。`Voice` 组件的导入和使用也随模板移入。
- **SettlementScreen.vue** — 结算界面（完成/未完成状态展示 + 不认识单词弹窗 + Exit/Next/Restart 操作按钮）。

### 父组件的变化
- **MemoryMain.vue**：移除 `nextTick` 导入和 `locationGroup` 函数，添加 `GroupSelector` 导入，侧栏模板替换为 `<GroupSelector>` 组件调用。
- **MemoryWord.vue**：移除 `Voice` 导入，添加 `PracticeCard` 和 `SettlementScreen` 导入。模板从两段内联 `div`（`v-if="beginMemory"` / `v-else`）替换为两个具名组件的条件渲染。所有状态变量、业务逻辑函数、`watch`、生命周期、键盘快捷键保持不动。

### 未改动的内容
- 未添加任何新功能
- 未更改任何布局/样式
- 未更改数据流和逻辑
- 键盘快捷键仍然在 MemoryWord 父组件中集中管理
