import Link from "next/link";

export const RestaurantNavBar = ({slug}: {slug: string}) => {
    return (
        <nav className="flex text-reg border-b pb-2">
            <Link href={`/pages/restaurant/${slug}`} className="mr-7"> Overview </Link>
            <Link href={`/pages/restaurant/${slug}/menu`} className="mr-7"> Menu </Link>
        </nav>
    );
}