<template>
    <v-app>
        <v-content>
            <div class="editor">
                <h1>エディター画面</h1>
                <span>{{ user.displayName }}</span>
                <v-btn @click="logout">ログアウト</v-btn>
                <div class="editorWrapper">
                    <div class="memoListWrapper">
                        <div class="memoList" v-for="(memo, index) in memos" :key="index" @click="selectMemo(index)" :data-selected="index == selectedIndex">
                            <p class="memoTitle">{{ displayTitle(memo.markdown) }}</p>
                        </div>
                        <v-btn @click="addMemo">メモの追加</v-btn>
                        <v-btn v-if="memos.length > 1" @click="deleteMemo">選択中のメモを削除</v-btn>
                        <v-btn  @click="saveMemos">メモ保存</v-btn>
                    </div>
                    <textarea class="markdown" v-model="memos[selectedIndex].markdown"></textarea>
                    <div class="preview markdown-body" v-html="preview()"></div>
                </div>
            </div>
        </v-content>
    </v-app>
</template>

<script>
import marked from "marked";
export default {
    name: "editor",
    props: ["user"],
    data() {
        return {
            memos: [
                {
                    markdown: ""
                }
            ],
            selectedIndex: 0
        };
    },
    created: function() {
        firebase
            .firestore()
            .collection("memos")
            .doc(this.user.uid)
            .get()
            .then(doc => {
                if (doc.exists && doc.data().memos) {
                    this.memos = doc.data().memos;
                }
            });
    },
    mounted: function() {
        document.onkeydown = e => {
            if (e.key == "s" && (e.metaKey || e.ctrlKey)) {
                this.saveMemos();
                return false;
            }
        }
    },
    beforeDestroy: function()  {
        document.onkeydown = null;
    },
    methods: {
        logout: function() {
            firebase.auth().signOut();
        },
        addMemo: function() {
            this.memos.push({
                markdown: "無題のメモ"
            });
        },
        selectMemo: function(index) {
            this.selectedIndex = index;
        },
        deleteMemo: function() {
          this.memos.splice(this.selectedIndex, 1);
          if (this.selectedIndex > 0) {
              this.selectedIndex--;
          }  
        },
        saveMemos: function() {
            firebase
                .firestore()
                .collection("memos")
                .doc(this.user.uid)
                .set({ memos: this.memos });
        },
        preview: function() {
            return marked(this.memos[this.selectedIndex].markdown);
        },
        displayTitle: function(text) {
            return text.split(/\n/)[0];
        }        
    }
};
</script>
<style lang="scss" scoped>
.editorWrapper {
    display: flex;
}
.memoListWrapper {
    width: 20%;
    border-top: 1px solid #000;
}
.memoList {
    padding: 10px;
    box-sizing: border-box;
    text-align: left;
    border-bottom: 1px slid #000;
    &:nth-child(even) {
        background-color: #ccc;
    }
    &[data-selected="true"] {
        background-color: #ccf;
    }
}
.memoTitle {
    height: 1.5em;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
}
.addMemoBtn {
    margin-top: 20px;
}
.markdown {
    width: 50%;
    height: 500px;
}
.preview {
    width: 50%;
    text-align: left;
}
.deleteMemoBtn {
    margin: 10px;
}
</style>
