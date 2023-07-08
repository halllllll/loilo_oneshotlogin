// ==UserScript==
// @name loilo utilities for admin
// @namespace http://tampermonkey.net/
// @version 0.9.1
// @description `BE HUMAN`
// @author GIG SCHOOL
// @match https://n.loilo.tv/users/sign_in*
// @match https://n.loilo.tv/schools/*/students*
// @match https://n.loilo.tv/schools/*/teachers*
// @match https://n.loilo.tv/schools/*/user_groups*
// @match https://n.loilo.tv/user_groups/*/memberships*
// @icon https://www.google.com/s2/favicons?sz=64&domain=loilo.tv
// @grant GM_addStyle
// @grant GM_getResourceText
// @run-at document-end
// ==/UserScript==

/**-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 * 
 * EDIT AREA (only you should do)
 * 
 **-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */

/**
 * 小学校
 */
const E_INFO_LOILO = [
    ["sample第二小学校", "sample_e_school_id1", "admin_id", "admin_pw"],
    ["sample第五北小学校", "sample_e_school_id2", "admin_id", "admin_pw"],
];
/**
 * 中学校
 */
const J_INFO_LOILO = [
    ["sample第二中学校", "sample_j_school_id1", "admin_id", "admin_pw"],
    ["sample第五中小学校", "sample_j_school_id2", "admin_id", "admin_pw"],
];
/**
 * 小中学校以外
 */
const SPECIAL_INFO_LOILO = [
];

class SchoolInfo {
    /**
    * @constructor
    * @param {string} _school_name - school name
    * @param {string | null} _school_id - school id (of loilo note)
    * @param {string} _school_username - school username, a.k.a Admin account id
    * @param {string} _school_password - Admin account password
    */
    constructor(_school_name, _school_id = null, _school_username, _school_password) {
        /** @type {string} */
        this.school_name = _school_name;
        /** @type {string | null}} */
        this.school_id = _school_id;
        /** @type {string} */
        this.school_admin = _school_username;
        /** @type {string} */
        this.school_password = _school_password;
    }
    /** @return {string} */
    get name() {
        return this.school_name;
    }
    /** @return {string} */
    get id() {
        return this.school_id;
    }
    /** @return {string} */
    get admin() {
        return this.school_admin;
    }
    /** @return {string} */
    get password() {
        return this.school_password;
    }
}

/**-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 * 
 * Utilities 
 * 
 **-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */

class Utils {
    /**
    * https://qiita.com/megadreams14/items/b4521308d5be65f0c544
    * @param {Array<Array<string>>} records - 二次元配列で渡す。最初はcsvのヘッダーになる
    * @param {string} filename - ファイル名
    * @return {void}
    */
    static exportCSV(records, filename = 'result') {
        const data = records.map((record) => record.join(',')).join('\r\n');

        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, data], { type: 'text/csv' });
        const url = (window.URL || window.webkitURL).createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${filename}.csv`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /**
    * 組み込みで時間日付のフォーマットくらいあるかと思ったら無いっぽい
    * @return {string} - current `YYYY_MM_DD` formated date
    */
    static nowYYYY_MM_DD() {
        const now = new Date();
        return `${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${(now.getDate()).toString().padStart(2, '0')}`;
    }

    /**
     * @return {string} - current `YYYY_MM_DD_hhmmss`
     */
    static nowYYYY_MM_DD_hhmmss() {
        const now = new Date();
        return `${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${(now.getDate()).toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    }

    /**
    * フィッシャーイェーツでシャッフル
    * @param {Array} a
    * @returns {Array}
    */
    static shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            //乱数生成を使ってランダムに取り出す値を決める
            const r = Math.floor(Math.random() * (i + 1));
            //取り出した値と箱の外の先頭の値を交換する
            const tmp = a[i];
            a[i] = a[r];
            a[r] = tmp;
        }
        return a
    }


    /**
     * replace element
     * @param {HTMLElement} element
     * @param {string} src
     */
    static repaceImage(element, src) {
        element.src = src
    }

}


/**-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 * 
 * ENTRY POINT
 *
 **-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */
window.onload = () => {
    (function () {
        'use strict';
        // Your code here...
        const URL = window.location.href;

        /**
        * URL Matcher
        * ページごとに切り替える
        */
        if (URL.match(/^(https:\/\/|http:\/\/|)n\.loilo\.tv\/*/ig) != null) {

            if (URL.match(/^(https:\/\/|http:\/\/|)n\.loilo\.tv\/users\/sign_in/ig) !== null) {
                console.log("ログイン画面");
                LOGINVIEW();
            } else if (URL.match(/^(https:\/\/|http:\/\/|)n\.loilo\.tv\/schools\/\d+\/user_groups\.*$/ig) !== null) {
                console.log("クラス一覧画面");
                CLASSLISTVIEW();
            } else if (URL.match(/^(https:\/\/|http:\/\/|)n\.loilo\.tv\/schools\/\d+\/user_groups\/\d+\/memberships\.*$/ig) !== null) {
                console.log("クラス編集画面");
                CLASSEDITVIEW();
            } else if (URL.match(/^(https:\/\/|http:\/\/|)n\.loilo\.tv\/schools\/\d+\/students\.*?/ig) !== null) {
                console.log("生徒一覧画面");
                STUDENTLISTVIEW();
            } else if (URL.match(/^(https:\/\/|http:\/\/|)n\.loilo\.tv\/schools\/\d+\/teachers\.*?/ig) !== null) {
                console.log("先生一覧画面")
            } else {
                console.log("何");
            }
        } else {
            console.log(`its not my turn...`);
        }
    })();
}


/**-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 * 
 * Pages
 *
 **-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 */

const LOGINVIEW = () => {
    /**
    *
    * wait element for page
    *
    */

    (() => {
        const check = setInterval(function () {
            let challenge = 0;
            const loilo_admin_header = document.querySelector('.navbar > div:nth-child(1)');
            console.log("waiting login page element...")
            if (loilo_admin_header) {
                clearInterval(check);
                onLoginLoilo();
            } else if (++challenge > 10) {
                clearInterval(check);
                alert("仕様変更の模様\nスクリプトをアップデートしてもらってください")
                return;
            }
        }, 500)
    })();


    /**
     *  Login Fetch
     * （ロイロノートの管理画面のログイン画面のtsの実装から引用してjsにした）
     * @param {string} schoolCode 
     * @param {string} username 
     * @param {string} password 
     * @returns 
     */
    const signIn = async (schoolCode, username, password) => {
        try {
            const reqParams = new URLSearchParams();
            reqParams.append("user[school][code]", schoolCode);
            reqParams.append("user[username]", username);
            reqParams.append("user[password]", password);
            reqParams.append("authenticity_token", document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content"));

            const response = await fetch("/users/sign_in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: reqParams,
            });

            if (response.status === 200) {
                return null;
            } else if (response.status === 422) {
                const data = await response.json();
                const error = new Error(data.error);
                console.error(error);
                return error;
            } else {
                const error = new Error("");
                console.error(error);
                return error;
            }
        } catch (err) {
            console.error(err);
            return new Error("sign in error");
        }
    }

    /**
     * generate schools information with Map(ShoolInfo)
     * @param {Array<Array<string>>} data 
     * @param {string} filtering_word - a keyword for filtering (partial match to school name)
     * @returns {Map<string, SchoolInfo>}
     */
    const genSchoolMap = (data, filtering_word = "") => {
        filtering_word = filtering_word.trim();
        const infoMap = new Map();
        data.forEach(v => {
            if (filtering_word !== "") {
                if (!(v[0].includes(filtering_word))) {
                    return;
                }
            }
            infoMap.set(v[1], new SchoolInfo(
                _school_name = v[0],
                _school_id = v[1],
                _school_username = v[2],
                _school_password = v[3]
            ))

        });
        return infoMap;
    }

    /**
     * generate btns to login school
     * @param {Map<string, SchoolInfo>} m 
     * @returns {string} - HTMLElementではなく文字です
     */
    const genSchoolBtn = (m) => {
        let ret = "";
        m.forEach((v, k) => {
            if (v instanceof SchoolInfo !== true) {
                console.log(`${v} is not SchoolInfo class...`);
            } else {
                let pre_logined = sessionStorage.pre_login ?? null;
                ret += `<button class="dropdown-item" id="btn_${k}" name="oneshot" role="button" tabindex="0">${v.name}${pre_logined === k ? " - （前回ログイン済）" : ""}</button>`;
            }
        });
        return ret;
    }

    /**
     * ログイン用イベント付与
     * （`location.href`で強制的にページ遷移する）
     * @param {Map<string, SchoolInfo>} m
     * @return {boolean}
     */
    const addEventsOnSchoolName = (m) => {
        /** @type {boolean} result */
        let result = true
        m.forEach((v, k) => {
            try {
                document.getElementById(`btn_${k}`).addEventListener('click', (e) => {

                    // Reactに修正されたので直接DOMを変えてもReactのStateには反映されない。
                    // 直接apiを叩く方針に変更（2023/07/04）

                    // highjack button behavior and add loading spinner
                    const btn = document.querySelector(".btn-block");
                    btn.setAttribute("disabled", "");
                    const spinnerComponent = document.createElement("span");
                    spinnerComponent.classList.add("m-1");
                    const spinner = document.createElement("span");
                    spinner.classList.add("spinner-border", "spinner-border-sm");
                    spinner.setAttribute("role", "status");
                    spinner.setAttribute("aria-hidden", "true");
                    spinnerComponent.appendChild(spinner);
                    btn.insertAdjacentElement("afterbegin", spinner);

                    // message
                    const msg = document.querySelector("html body div#app-root div#main div.container div.text-center.m-4")
                    msg.textContent = `${v.school_name} にOneShotLogin 🍄...`;

                    // fetch directly call api
                    (async () => {
                        await signIn(k, v.admin, v.password)
                        sessionStorage.pre_login = k;
                        location.href = "/dashboard"
                    })();
                });
                return;
            } catch (err) {
                result = false;
            }
        });
        return result;
    }



    const onLoginLoilo = () => {

        const login_menu = `
    <div
    class="nav justify-content-end navbar-collapse collapse"
    id="navbar-collapse"
    role="navigation"
    aria-expanded="false"
    >
    <div class="ms-auto navbar-nav">
    <div class="nav-item show dropdown">
    <a
    id="navbar-nav"
    aria-expanded="true"
    role="button"
    class="dropdown-toggle show nav-link"
    tabindex="0"
    href="#"
    >学校を選択してログイン</a
    >
    <div
    id="dropdown-content"
    aria-labelledby="navbar-nav"
    data-bs-popper="static"
    class="dropdown-menu show"
    style="max-height: 500px; overflow: scroll; display: none;"
    >
    <div style="position: sticky; z-index: 1; top: 0; background-color: white; padding-top: 8px;">
    <div class="dropdown-header" role="heading">
    <input
    id="oneshotform"
    class="form-control"
    placeholder="OneShotLogin to..."
    type="text"
    autocorrect="off"
    autocapitalize="none"
    aria-autocomplete="list"
    />
    </div>
    <hr class="dropdown-divider" role="separator" />
    </div>
    <div class="dropdown-header" role="heading">
    小学校（登録数 ${E_INFO_LOILO.length}）
    </div>
    <div id="e_school_btns_area"></div>
    <hr class="dropdown-divider" role="separator" />
    <div class="dropdown-header" role="heading">
    中学校（登録数 ${J_INFO_LOILO.length}）
    </div>
    <div id="j_school_btns_area"></div>
    <hr class="dropdown-divider" role="separator" />
    <div class="dropdown-header" role="heading">
    その他（登録数 ${SPECIAL_INFO_LOILO.length}）
    </div>
    <div id="s_school_btns_area"></div>
    </div>
    </div>
    </div>
    </div>
    `
        const loilo_admin_header = document.querySelector('.navbar > div:nth-child(1)');

        loilo_admin_header.insertAdjacentHTML('beforeend', login_menu);

        // define menu events
        {
            const gigBtn = document.getElementById("navbar-nav");
            gigBtn.addEventListener("click", e => {
                const c = document.getElementById("dropdown-content");
                const s = c.getAttribute("style")
                if (s === "max-height: 500px; overflow: scroll; display: none;" || s === "max-height: 500px; overflow: scroll; display: none") {
                    c.setAttribute("style", "max-height: 500px; overflow: scroll;")
                } else if (s === "max-height: 500px; overflow: scroll;") {
                    c.setAttribute("style", "max-height: 500px; overflow: scroll; display: none;")
                }
            });
        }

        // init
        {
            const e_school_btns_area = document.getElementById("e_school_btns_area");
            const j_school_btns_area = document.getElementById("j_school_btns_area");
            const s_school_btns_area = document.getElementById("s_school_btns_area");

            updateMenu(E_INFO_LOILO, e_school_btns_area);
            updateMenu(J_INFO_LOILO, j_school_btns_area);
            updateMenu(SPECIAL_INFO_LOILO, s_school_btns_area);
        }

        // increment search
        {
            const oneshotform = document.getElementById("oneshotform");
            if (oneshotform === undefined) {
                alert("you can't use increment search")
                return;
            }
            oneshotform.addEventListener("keyup", e => {
                updateMenu(E_INFO_LOILO, e_school_btns_area, oneshotform.value);
                updateMenu(J_INFO_LOILO, j_school_btns_area, oneshotform.value);
                updateMenu(SPECIAL_INFO_LOILO, s_school_btns_area, oneshotform.value);
            })
        }
    }

    /**
     * @param {Array<Array<string>>} SCHOOL_INFO_LOILO - school info base data
     * @param {HTMLElement} target_element - html element for reflecting menu list, with click event.
     * @param {string} keyword - filtering keywarod
     */
    const updateMenu = (SCHOOL_INFO_LOILO, target_element, keyword = "") => {
        const school_info_map = genSchoolMap(SCHOOL_INFO_LOILO, keyword)
        addEventsOnSchoolName(school_info_map);
        const school_btns = genSchoolBtn(school_info_map);

        // remove and replace
        while (target_element?.firstChild) {
            target_element?.removeChild(target_element?.firstChild);
        }

        target_element?.insertAdjacentHTML("afterbegin", school_btns);

        // event listener
        addEventsOnSchoolName(school_info_map);

    }
}

const CLASSLISTVIEW = () => {
    /**
    *
    * wait element for page
    *
    */
    (() => {
        const check = setInterval(function () {
            let challenge = 0;
            const props = document.getElementById("app-props")
            console.log("waiting login page element...")
            if (props) {
                clearInterval(check);
                onClassListPage();
            } else if (++challenge > 10) {
                clearInterval(check);
                alert("仕様変更の模様\nスクリプトをアップデートしてもらってください")
                return;
            }
        }, 500)
    })();


    const onClassListPage = () => {
        const props = document.getElementById("app-props")?.dataset?.props;
        if (props === undefined) {
            console.log("props not found...")
            return;
        }
        const data = JSON.parse(props)
        const th = document.querySelector(".table > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(2)")
        const sp = document.createElement('span')
        sp.textContent = `（合計 ${data.userGroupsTotal} 学級）`
        th.insertAdjacentElement("beforeend", sp);
    }
}

const CLASSEDITVIEW = () => {
    /**
    *
    * wait element for page
    *
    */
    (() => {
        const check = setInterval(function () {
            let challenge = 0;
            const props = document.getElementById("app-props")
            console.log("waiting class edit page element...")
            if (props) {
                clearInterval(check);
                onClassEditPage();
            } else if (++challenge > 10) {
                clearInterval(check);
                alert("仕様変更の模様\nスクリプトをアップデートしてもらってください")
                return;
            }
        }, 500)
    })();


    const onClassEditPage = () => {
        const props = document.getElementById("app-props")?.dataset?.props;
        if (props === undefined) {
            console.log("props not found...")
            return;
        }
        const data = JSON.parse(props)

        // count
        const t = document.querySelector("div.page-header:nth-child(3) > h2:nth-child(1) > div:nth-child(1)");
        const sp = document.createElement("span")
        sp.className = "fs-5"
        sp.textContent = `（生徒数 ${data.studentsTotal} 人）`
        t.insertAdjacentElement("beforeend", sp)

        // export button
        const btn_group = document.querySelector("div.mx-2");
        const export_btn_html = `
    <div class="btn-group"><button type="button" id="export_btn" class="btn btn-default"><i class="far fa-arrow-alt-circle-down"></i><span class="ms-1">エクスポート（csv）</span></button></div>
    `;
        btn_group.insertAdjacentHTML("beforeend", export_btn_html);

        document.getElementById("export_btn").addEventListener("click", e => {
            // csvで吐き出すデータを用意（二次元配列）
            let result = [["displayName", "sortKey", "userID", "google sso", "azure sso"]];
            data.students.forEach((row, idx) => {
                result = [...result, [row.displayName, row.sortKey, row.username, row.googleEmail, row.azurePreferredUsername]]
            })
            const file_name = `${data.school.name}_${data.userGroup.name}_${Utils.nowYYYY_MM_DD_hhmmss()}`
            Utils.exportCSV(result, file_name)
        })
    }

}

const STUDENTLISTVIEW = () => {
    /**
    *
    * wait element for page
    *
    */
    (() => {
        const check = setInterval(function () {
            let challenge = 0;
            const props = document.getElementById("app-props")
            console.log("waiting class edit page element...")
            if (props) {
                clearInterval(check);
                onStudentListPage();
            } else if (++challenge > 10) {
                clearInterval(check);
                alert("仕様変更の模様\nスクリプトをアップデートしてもらってください")
                return;
            }
        }, 500)
    })();

    const onStudentListPage = () => {
        const props = document.getElementById("app-props")?.dataset?.props;
        if (props === undefined) {
            console.log("props not found...")
            return;
        }
        const data = JSON.parse(props)

        const header = document.querySelector(".d-flex > div:nth-child(2)")
        const sp = document.createElement("span")
        sp.className = "fs-5"
        sp.textContent = `（総登録数 ${data.studentsTotal} 人）`
        header.insertAdjacentElement("beforeend", sp)

        // all users (in page)
        /**
         * @type {Array<Map<string, Object>>} stundents
         */
        const students = [...Object.values(data.students)].flat().reduce((m, val) => {
            m.set(val.username, val);
            return m
        }, new Map())

        // id check
        /**
         * @type {HTMLTableElement} tbody
         */
        const tbody = document.querySelector(".table > tbody");
        if (tbody === undefined) return;
        /**
         * @type {HTMLCollection} row 
         */
        for (let row of tbody.rows) {
            if (row.cells.length !== 7) continue;
            const rowCells = Array.from(row.cells);
            const targetCell = rowCells[3]
            const userid = targetCell.innerText
            const user = students.get(userid);
            if ((user.googleEmail !== null && userid !== user.googleEmail) || (user.azurePreferredUsername !== null && userid !== user.azurePreferredUsername)) {
                targetCell.firstChild.insertAdjacentHTML("beforeend", `<span data-bs-toggle="tooltip" data-bs-placement="top" title="連携しているIDがユーザーIDと等しくなさそう"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fe930d" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>
                </svg ></span >`)
            }
        }
    }
}