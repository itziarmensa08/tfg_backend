export interface Aircraft {
    name: String;
    metro: String;
    profileImage?: String;
    elevationImage?: String;
    visible: Boolean,
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