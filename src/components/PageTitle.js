export default function PageTitle({ title }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-highlighted">
        {title}
      </h1>
    </div>
  );
}

