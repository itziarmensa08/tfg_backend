export interface Aircraft {
    name: String;
    metro: String;
    profileImage?: String;
    elevationImage?: String;
    profile: {
        nMotors: {
            heightFirstSegment: number;
            heightSecondSegment: number;
        },
        failure: {
            heightFirstSegment: number;
            heightSecondSegment: number;
        }
    }
}