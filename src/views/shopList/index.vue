<template>
  <div class="app-container">
    <avue-crud
      :data="data"
      :option="option"
      :table-loading="tableLoading"
      :page.sync="page"
      @current-change="currentChange"
      @refresh-change="refreshChange"
      @search-change="searchChange"
    >
    <template slot="shopLink" slot-scope="{row: { shopLink }}">
      <el-tooltip effect="dark" :content="shopLink" placement="top">
        <div slot="content">
          <el-link type="primary" :href="shopLink" target="_blank">{{ shopLink }}</el-link>
        </div>
        <el-link type="primary" :href="shopLink" target="_blank" :underline="false">访问</el-link>
      </el-tooltip>
    </template>
    <template slot-scope="scope" slot="useStatus">
      <el-switch
        v-model="scope.row.useStatus"
        active-color="#13ce66"
        inactive-color="#ff4949"
        @change="(val) => {
          useStatusChange(val, scope.row)
        }"
        inactive-value="disable"
        active-value="enable"
      />
    </template>
    </avue-crud>

    <Confirm ref="confirm" />
  </div>
</template>

<script>
import Confirm from "@components/Confirm";
import { Dic } from "@utils";
import { Page } from "@minxin";

export default {
  components: {
    Confirm,
  },
  mixins: [Page],
  data() {
    return {
      search: {},
      tableLoading: false,
      search: {},
      data: [],
      option: {
        align: "center",
        menuAlign: "center",
        labelWidth: "100",
        editBtn: false,
        delBtn: false,
        addBtn: false,
        viewBtn: true,
        dialogWidth: this.$dialogWidth,
        span: 24,
        dialogClickModal: false,
        column: [
          {
            label: "店铺名称",
            prop: "shopName",
            search: true
          },
          {
            label: "店铺链接",
            prop: "shopLink",
            slot: true,
            type: 'url'
          },
          {
            label: "用户",
            prop: "name",
            search: true
          },
          {
            label: "法人姓名",
            prop: "legalPrsonName",
            hide: true,
          },
          {
            label: "法人身份证",
            prop: "legalPrsonCard",
            hide: true,
          },
          {
            label: "邮箱",
            prop: "email",
            hide: true,
          },
          {
            label: "营业执照",
            prop: "businessLicense",
            type: "upload",
            accept: "image/png, image/jpeg",
            listType: "picture-img",
            multiple: false,
            hide: true,
            propsHttp: {
              home: this.$fileUrl,
              res: "data",
            },
            tip: "只能上传jpg/png图片，且不超过5M",
            action: "/common/uploadFile",
            rules: [
              {
                required: true,
                message: "上传营业执照",
              },
            ],
            uploadPreview: this.$onUploadPreview,
          },
          {
            label: "联系人姓名",
            prop: "contactName"
          },
          {
            label: "联系人电话",
            prop: "contactPhone"
          },
          {
            label: "店铺状态",
            prop: "useStatus",
            type: 'switch',
            slot: true,
            activeColor: '#13ce66',
            inactiveColor: '#ff4949',
            dicData: Dic.find('DIC010')
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 列表
    async getList(cb = () => {}) {
      this.tableLoading = true;
      const result = await this.$fetchGet("/admin/shopList/index", {
        ...this.search,
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      });
      this.tableLoading = false;
      this.data = result ? result.rows.map(item => {
        item.name = item.user.name;
        return item
      }) : [];
      this.page.total = result ? result.count : 0;
      cb();
    },
    // 分页
    currentChange() {
      this.getList();
    },
    // 搜索
    async searchChange(params, done) {
      this.search = params;
      this.page.currentPage = 1;
      this.getList(done);
    },
    // 重置
    refreshChange() {
      this.page.currentPage = 1;
      this.getList();
    },
    async useStatusChange (val, row) {
      console.log(val);
      const { id } = row;
      const result = await this.$fetchPost('/admin/shopList/useStatus', {
        id,
        useStatus: val
      });
      this.getList();
    }
  },
};
</script>

<style>
</style>