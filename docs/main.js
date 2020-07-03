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
      text: `<script src="https://firebasestorage.googleapis.com/v0/b/website-d2f19.appspot.com/o/nn-v0.js?alt=media&token=cd7b6c3b-0796-411c-a49d-89f22277119a"></script>`,
      icon: "success",
    });
  }
}
