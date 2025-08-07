
export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer items-center p-4 bg-neutral text-neutral-content">
            <div className="items-center grid-flow-col">
                <p>Copyright © {currentYear} - All right reserved</p>
            </div>
            <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            </div>
        </footer>
    )
}