export default `
<template>
    <div class="main-box">
        <div class="filter-bar_box">
            <div class="left"></div>
            <div class="right"><% filterHtmlArr.forEach(function(html){ %>
                <div class="filter-item">
                    <%- html %>
                </div>
            <% }); %></div>
        </div>
        <aoe-table ref="table" :rowKey="'index'" :columns="columns" :dataKey="'data'" :dataApi="dataApi" :showPage="true">
            <% tableHtmlArr.forEach(function(html){ %><%- html %><% }); %>
            <div slot="action" slot-scope="row"><% actionHtmlArr.forEach(function(html){ %><%- html %><% }); %></div>
        </aoe-table>
    </div>
</template>

<script>
// import { api } from '@/request/api';
export default {
    data() {
    return {
        <% dataArr.forEach(function(str){ %>
            <%- str %>
        <% }); %>
        dataApi: null,
    };
    },
    mounted() {
        this.getData();
    },

    methods: {
        async getData() {
            await this.$refs['table'].setPageOne({ ...this.filterForm });
        },
        <% methodsArr.forEach(function(str){ %>
            <%- str %>
        <% }); %>
    },
};
</script>
<style lang="less" scoped>
    <% cssArr.forEach(function(str){ %>
        <%- str %>
    <% }); %>
    .main-box {
        min-height: 770px;
        background: #fff;
        .filter-bar_box {
            width: 100%;
            padding: 24px;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .left {
            }
            .right {
                display: flex;
                align-items: center;
            }
            .filter-item {
                display: flex;
                align-items: center;
                margin-left: 24px;
                .filter-item_label {
                    margin-right: 10px;
                    font-size: 14px;
                    line-height: 22px;
                    color: #333333;
                    opacity: 1;
                }
            }
        }
    }
    .action-btn {
        color: #1890ff;
        cursor: pointer;
    }
    .action-btn.disabled {
        color: #999999;
        cursor: not-allowed;
        pointer-events: none;
    }
</style>
`;
