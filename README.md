# LoiloNote - OneShotLogin
This is a browser extension (userscript) for the administrative interface of the [LoiLo Note School](https://n.loilo.tv/en/) application, frequently used in the [GIGA School Program](https://www.mext.go.jp/a_menu/other/index_00001.htm) that started in 2020. It is primarily intended for use in centralized management by organizations similar to the ['GIGA School Operation Support Center'](https://www.mext.go.jp/content/20211118-mxt_zaimu-000019059_05.pdf), which has gained widespread adoption in some municipalities since the 2022 fiscal year under the GIGA School Concept.

---

2020年から始まった**GIGAスクール構想**においてよく使用されるアプリである[ロイロノート・スクール](https://n.loilo.tv/en/)の、管理者画面用のブラウザ拡張機能（userscript）です。主に2022年度から一部の自治体で普及が広まったGIGAスクール構想の管理組織「GIGAスクール運営支援センター」に類する組織での、一元的な管理においての使用を想定しています。

## features
- Select the target school right from the login screen. There is no need to copy-paste or remember the school ID, user ID, or password each time.
- Easy setup. Simply add data in the same manner as the script template. All you need to do is list the school name, school ID, admin ID, and admin password.
- Updated to match the early July 2023 update. On screens where React is used, we offer handy features based on data obtained from props, such as displaying the total account number or exporting single class information.

---

- ログイン画面から対象の学校を選ぶだけ。いちいち学校ID,ユーザーID,パスワードをコピペしたり覚えたりする必要はありません。
- 簡単設定。スクリプトのテンプレートを参考に、同じ方式でデータを追加して、終わり！学校名・学校ID・管理者ID・管理者PWのリストを列挙するだけです。
- 2023/07初頭のアップデートに対応。Reactが使われている画面では、propsから得られるデータで、便利な機能を提供。アカウント総数表示や単一クラス情報のcsv形式でのエクスポートなど。

# Roadmap

Currently, no features are provided on screens that do not support React (i.e., 'Teacher List' and 'Class List').


まだReactに対応してない画面（「先生一覧」と「授業一覧」）では機能の提供がないです。




# Env
using [TamperMonkey](https://www.tampermonkey.net/), thanks!

# LICENCE
MIT