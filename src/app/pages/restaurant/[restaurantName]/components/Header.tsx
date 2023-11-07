const FormatHeaderName = (name: string) => {
    const formatName = name.split('-');
    formatName[formatName.length - 1] = `(${formatName[formatName.length - 1]})`;
    const formatWord = formatName.join(' ')

    return formatWord
} 

export const Header = ({name}: {name: string}) => {

    return (
        <div className="h-96 overflow-hidden">
            <div
                className="bg-center bg-gradient-to-r from-[#0f1f47] to-[#5f6984] h-full flex justify-center items-center"
            >
                <h1 className="text-7xl text-white capitalize text-shadow text-center">
                    {FormatHeaderName(name)}
                </h1>
            </div>
        </div>
    )
}