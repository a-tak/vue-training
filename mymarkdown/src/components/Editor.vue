<template>
    <v-app dark>
        <v-content>
            <div class="editor">
                <h1 class="title">エディター画面</h1>
                <span class="subheading">{{ user.displayName }}</span>
                <v-btn @click="logout">ログアウト</v-btn>
                <div class="editorWrapper">
                    <v-card>
                        <v-list>
                            <v-list-tile v-for="(memo, index) in memos" :key="index" @click="selectMemo(index)" :data-selected="index == selectedIndex">
                                <v-list-tile-action>
                                    <v-icon v-if="index == selectedIndex" color="pink">star</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <p class="memoTitle">{{ displayTitle(memo.markdown) }}</p>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                        <v-btn class="addMemoBtn" @click="addMemo">メモの追加</v-btn>
                        <v-btn class="deleteMemoBtn" v-if="memos.length > 1" @click="deleteMemo">選択中のメモを削除</v-btn>
                        <v-btn  @click="saveMemos">メモ保存</v-btn>
                    </v-card>
                    <v-card class="markdown">
                        <v-textarea v-model="memos[selectedIndex].markdown"></v-textarea>
                    </v-card>
                    <v-card class="preview markdown-body">
                        <div v-html="preview()"></div>
                    </v-card>
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
