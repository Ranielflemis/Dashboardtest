const Loading = ({ text = "Carregando..." }) => {
    return (
        <div
            className="
                fixed inset-0
                bg-black/80
                flex flex-col
                items-center
                justify-center
                z-50
            "
        >
            <svg
                className="w-16 h-16 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />

                <path
                    className="opacity-100"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
            </svg>

            <p className="mt-4 text-white text-lg">
                {text}
            </p>
        </div>
    );
};

export default Loading;