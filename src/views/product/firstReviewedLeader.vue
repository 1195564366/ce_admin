<template>
  <el-dialog title="初审审核" :visible="show" @close="close">
    <avue-form
      :option="option"
      v-model="form"
      @submit="submit"
      ref="form"
      @reset-change="resetChange"
    ></avue-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      productName: null,
      adminStatus: null,
      adminRejectReason: null,
      adminAmazonSendGoodLink: null,
      id: null,
      form: {
        status: null,
        rejectReason: null,
      },
      option: {
        labelWidth: "125",
        column: [
          {
            label: "产品名称",
            prop: "productName",
            detail: true,
            span: 24,
          },
          {
            label: "管理员审核状态",
            prop: "adminStatus",
            type: 'radio',
            detail: true,
            dicData: [
              {
                label: "通过",
                value: "3",
              },
              {
                label: "驳回",
                value: "2",
              },
            ],
          },
          {
            label: "亚马逊发货链接",
            prop: "adminAmazonSendGoodLink",
            span: 24,
            detail: true,
            display: false
          },
          {
            label: "管理员驳回原因",
            prop: "adminRejectReason",
            span: 24,
            detail: true,
            display: false
          },
          {
            label: "审核状态",
            prop: "status",
            type: "radio",
            span: 24,
            dicData: [
              {
                label: "通过",
                value: "5",
              },
              {
                label: "驳回",
                value: "4",
              },
            ],
            rules: [
              {
                required: true,
                message: "选择审核状态",
              },
            ],
          },
          {
            label: "亚马逊发货链接",
            prop: "amazonSendGoodLink",
            span: 24,
            display: false,
            rules: [],
          },
          {
            label: "驳回原因",
            prop: "rejectReason",
            span: 24,
            type: "textarea",
            display: false,
            rules: [],
          },
        ],
      },
    };
  },
  watch: {
    "form.adminStatus": {
      handler (val) {
        const adminAmazonSendGoodLink = this.findObject(this.option.column, 'adminAmazonSendGoodLink');
        const adminRejectReason = this.findObject(this.option.column, 'adminRejectReason');
        if (val === '3') {
          adminAmazonSendGoodLink.display = true;
          adminRejectReason.display = false;
        } else {
          adminAmazonSendGoodLink.display = false;
          adminRejectReason.display = true;
        }
      },
      immediate: true
    },
    "form.status": {
      handler(val) {
        const rejectReason = this.findObject(
          this.option.column,
          "rejectReason"
        );
        const amazonSendGoodLink = this.findObject(this.option.column, "amazonSendGoodLink");
        console.log(val)
        if (val === '4') {
          rejectReason.display = true;
          rejectReason.rules = [
            {
              required: true,
              message: "输入驳回原因",
            },
          ];
        } else {
          rejectReason.display = false;
          rejectReason.rules = [];
        }
        if (val === '5' && this.adminStatus === '2') {
          amazonSendGoodLink.display = true;
          amazonSendGoodLink.rules = [{
            required: true,
            message: "输入亚马逊发货链接"
          }]
        } else {
          amazonSendGoodLink.display = false;
          amazonSendGoodLink.rules = []
        }
      },
      immediate: true,
    },
  },
  methods: {
    open(row) {
      this.show = true;
      const { id, productName, status, rejectReason, amazonSendGoodLink } = row;
      console.log(row);
      this.id = id;
      this.productName = productName;
      this.adminStatus = status;
      this.adminRejectReason = rejectReason;
      this.adminAmazonSendGoodLink = amazonSendGoodLink
      this.form = {
        productName,
        adminStatus: status,
        adminRejectReason: rejectReason,
        adminAmazonSendGoodLink: amazonSendGoodLink,
      };
    },
    close() {
      this.$refs['form'].resetForm();
      this.show = false;
    },
    // 表单清空
    resetChange() {
      this.form.productName = this.productName;
      this.form.adminStatus = this.adminStatus;
      this.form.adminRejectReason = this.adminRejectReason;
      this.form.adminAmazonSendGoodLink = this.adminAmazonSendGoodLink;
      this.form.status = null;
    },
    // 管理员初审提交
    async submit(form, done) {
      const { status, rejectReason, amazonSendGoodLink } = form;
      const result = await this.$fetchPost(
        "/admin/product/firstReviewed",
        {
          id: this.id,
          status,
          rejectReason,
          amazonSendGoodLink: amazonSendGoodLink || this.adminAmazonSendGoodLink,
          type: 'leader'
        },
        {
          allData: true,
        }
      );
      done();
      if (!result.success) return;
      this.$message.success("审核成功");
      this.close();
      this.$emit("ok");
    },
  },
};
</script>

<style>
</style>