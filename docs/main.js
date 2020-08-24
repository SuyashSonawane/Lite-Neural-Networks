function CopyToClipboard(containerid) {
  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select().createTextRange();
    document.execCommand("copy");
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().addRange(range);
    document.execCommand("copy");
    swal({
      title: "Copied",
      text: `<script src="https://cdn.jsdelivr.net/gh/suyashsonawane/Lite-Neural-Networks@latest/lib/nn-v0.js"></script>`,
      icon: "success",
    });
  }
}
