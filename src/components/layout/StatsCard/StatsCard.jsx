
const StatsCard = ({
    title,
    value,
    icon: Icon,
    color = "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    barColor = "bg-blue-400",
    maxValue = 0,
}) => {

    // Calcular a porcentagem da barra
    const porcentagem = maxValue > 0
        ? (value / maxValue) * 100
        : 0;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

            <div className="flex items-center justify-between">

                <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </span>

                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-3">
                        {value}
                    </h3>

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Total cadastrado
                    </p>
                </div>

                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
                >
                    <Icon size={27} />
                </div>

            </div>

            {/* Barra proporcional */}
            <div className="mt-5 h-1 w-full bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">

                <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${porcentagem}%` }}
                ></div>

            </div>

        </div>
    );
};

export default StatsCard;
