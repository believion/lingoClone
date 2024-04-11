type Props = {
    hearts: number,
    percentage: number,
    hasActiveSubscription: boolean;
}

const Header = ({
    hearts,
    percentage,
    hasActiveSubscription
                }: Props) => {
    return (
        <div>Header</div>
    )
}

export default Header;