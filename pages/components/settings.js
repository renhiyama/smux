export default function Settings({}) {
  return (
    <div className="px-4 py-4">
      <h1 className="text-sm font-semibold uppercase">Smux Settings</h1>
      <div className="mt-4 flex bg-slate-900 w-full lg:w-96 items-center overflow-hidden p-2 rounded-md border-2 border-slate-700 focus-within:border-blue-500/70">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          className="px-1 bg-slate-900 focus:outline-none w-full"
          placeholder="Search Your Recent Projects"
        />
      </div>
      <div className="my-8 md:flex w-md text-slate-300">
        <p className="block my-auto md:px-4">Background</p>
        <Input placeholder="Image URL" />
      </div>
    </div>
  );
}
function Input({ name, placeholder }) {
  return (
    <input
      className="block mt-4 md:my-auto bg-gray-900 rounded-md focus:outline-none border-2 border-slate-700 focus:border-indigo-700 text-slate-300 py-2 px-4 align-middle"
      placeholder={placeholder}
    ></input>
  );
}
