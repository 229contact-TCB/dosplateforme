interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-[#012B59] text-white p-4 shadow-lg">
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
}
