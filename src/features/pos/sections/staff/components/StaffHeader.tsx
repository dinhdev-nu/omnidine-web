import Button from "../../../ui/Button"

interface StaffHeaderProps {
  onAddStaff: (trigger: HTMLButtonElement) => void
}

const StaffHeader = ({ onAddStaff }: StaffHeaderProps) => (
  <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <h1
        id="staff-section-title"
        className="text-2xl leading-tight font-semibold break-words text-foreground"
      >
        Quản lý nhân viên
      </h1>
      <p className="mt-1 max-w-3xl leading-relaxed text-muted-foreground">
        Quản lý thông tin và quyền truy cập của nhân viên trong hệ thống POS.
      </p>
    </div>

    <Button
      variant="default"
      onClick={(event) => onAddStaff(event.currentTarget)}
      iconName="UserPlus"
      iconPosition="left"
      className="w-full shrink-0 sm:w-auto"
    >
      Thêm nhân viên
    </Button>
  </header>
)

export default StaffHeader
