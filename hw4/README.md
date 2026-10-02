# fatkie 與 fatkie-project 的 GitHub 操作紀錄

本文整理建立分支、合併、Fork 與 Pull Request 的操作方式，並區分目前能從終端紀錄及 repo 設定確認的動作，避免把操作範例誤寫成已完成的事實。

## Repo 關係與已確認的操作

- `fatkie` 的遠端 `origin` 是 `s111410512-art/fatkie`。
- `fatkie-project` 的遠端 `origin` 是 `fatkiee/fatkie`，這是提交 Pull Request 時使用的個人 repo。
- 終端紀錄中執行過 `git clone git@github.com:s111410512-art/fatkie.git`，工作目錄是 `_se`，因此 clone 下來的資料夾是 `_se/fatkie`。
- 終端紀錄中曾在 `_se/fatkie` 執行 `git push origin main`，並在 `fatkie-project` 執行 `git push`。
- `fatkie` repo 中目前可看到 `developGitBranch` 分支；`gitBranch.md` 也記錄了建立功能分支及合併的指令範例。

本機 Git 紀錄只能確認 repo、分支與 push 設定，無法單獨證明 GitHub 網頁上的 Fork 或 Pull Request 是否已建立或合併。

## 1. 建立分支

在要工作的 repo 中先更新主分支，再建立並切換到新分支：

```bash
git switch main
git pull origin main
git switch -c developGitBranch
```

完成修改後提交並推送分支：

```bash
git add .
git commit -m "描述這次修改"
git push -u origin developGitBranch
```

`developGitBranch` 是 `fatkie` repo 中目前可確認存在的分支名稱。若要在 Fork repo 提交 Pull Request，請在 `fatkie-project` 建立分支並推到 `fatkiee/fatkie` 的 `origin`。

## 2. 合併分支

若要在本機把功能分支合併到 `main`：

```bash
git switch main
git pull origin main
git merge developGitBranch
git push origin main
```

合併完成後若不再需要該分支，可刪除本機分支：

```bash
git branch -d developGitBranch
```

`gitBranch.md` 中的 `feature/user-profile` 是操作範例名稱；合併時要換成實際建立的分支。Fork 工作流程通常先透過 Pull Request 請原 repo 維護者審查，不要在尚未確認目標 repo 前直接推送到原 repo 的 `main`。

## 3. Fork

Fork 是在 GitHub 網站上建立，不是 `git clone`：

1. 開啟原 repo：<https://github.com/s111410512-art/fatkie>
2. 按右上角 **Fork**，選擇自己的 GitHub 帳號作為 Owner。
3. 建立完成後，Fork repo 會有自己的網址；目前 `fatkie-project` 設定的 `origin` 是 `git@github.com:fatkiee/fatkie.git`。

若要從命令列 clone 自己的 Fork：

```bash
git clone git@github.com:fatkiee/fatkie.git
```

在已 clone 的 Fork repo 中，`origin` 應指向自己的 Fork；可額外設定 `upstream` 指回原 repo，以便同步原 repo 更新：

```bash
git remote add upstream git@github.com:s111410512-art/fatkie.git
git fetch upstream
```

## 4. 建立 Pull Request

先在 Fork repo 建立工作分支、提交修改並推送：

```bash
git switch main
git pull origin main
git switch -c developGitBranch
# 修改檔案後
git add .
git commit -m "描述這次修改"
git push -u origin developGitBranch
```

接著在 GitHub 網站操作：

1. 開啟自己的 Fork repo `fatkiee/fatkie`，選擇 **Compare & pull request**；若沒有提示，進入 **Pull requests** 並按 **New pull request**。
2. 設定 **base repository** 為 `s111410512-art/fatkie`、**base** 為 `main`。
3. 設定 **head repository** 為 `fatkiee/fatkie`、**compare** 為 `developGitBranch`。
4. 檢查差異，填寫標題與說明，按 **Create pull request**。
5. Pull Request 經審查後，由有權限的人選擇 **Merge pull request**；建立 PR 不代表已經合併。

## 操作紀錄與範例的差異

目前可確認有 clone、push，以及 `developGitBranch` 分支的 repo 記錄。此資料夾中的 `gitBranch.md` 是分支與合併指令範例；本機資料未提供 GitHub Pull Request 編號或狀態，因此本文件不會宣稱 PR 已建立或已合併。