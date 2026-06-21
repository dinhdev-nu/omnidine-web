import ConfirmationDialog from "../../../ui/ConfirmationDialog"

export function ClearCartDialog({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xóa giỏ hàng"
      message="Bạn có chắc chắn muốn xóa tất cả món trong giỏ hàng?"
      confirmText="Xóa tất cả"
      cancelText="Hủy"
      variant="danger"
      icon="Trash2"
    />
  )
}
