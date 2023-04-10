import Swal from "sweetalert2/dist/sweetalert2.js";

const swalAlert = {
  computed: {},
  methods: {
    toast() {
      return Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    },
    showSuccessToaster(message) {
      this.toast().fire({
        icon: "success",
        title: message,
      });
    },
    showErrorToaster(message) {
      this.toast().fire({
        icon: "error",
        title: message,
      });
    },
    showWarningToaster(message) {
      this.toast().fire({
        icon: "warning",
        title: message,
      });
    },
    showSwalConfirm(message, callback_1, callback_2) {
      Swal.fire({
        title: message,
        icon: "warning",
        buttonsStyling: true,
        showCancelButton: true,
        confirmButtonText: "Yes, Continue",
        cancelButtonText: `Cancel`,
        confirmButtonColor: "#dc3545ed",
        cancelButtonColor: "#5a5c5ee0",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          callback_1();
        } else if (result.isDenied) {
          Swal.close();
        } else if (result.isDismissed) {
          callback_2();
        }
      });
    },
  },
};

export default swalAlert;
